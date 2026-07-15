import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Clock, HelpCircle, ArrowRight, CornerDownLeft, 
  Loader2, Mic, MicOff, ChevronRight, RotateCcw, Award, CheckCircle, AlertCircle, FileText,
  ShieldCheck
} from "lucide-react";
import WelcomeScreen from "./components/WelcomeScreen";
import SidebarQuestions from "./components/SidebarQuestions";
import EvaluationCard from "./components/EvaluationCard";
import FinalReportScreen from "./components/FinalReportScreen";
import TestSuite from "./components/TestSuite";
import { INTERVIEW_QUESTIONS, QUESTION_BANK, InterviewSession, QuestionEvaluation, OverallReport } from "./types";

export default function App() {
  // Application State
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(-1); // Used to review a previous question (-1 means active current question)
  const [showTestSuite, setShowTestSuite] = useState(false);
  
  // Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech-To-Text State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Error boundary indicator
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic Session Questions
  const getSessionQuestions = () => {
    if (session?.isCustomTrack && session.customQuestionIds) {
      return session.customQuestionIds
        .map(id => QUESTION_BANK.find(q => q.id === id))
        .filter((q): q is typeof QUESTION_BANK[0] => !!q);
    }
    return INTERVIEW_QUESTIONS;
  };
  const sessionQuestions = getSessionQuestions();

  // Start a new Interview Session
  const handleStartSession = (
    name: string,
    role: string,
    company: string,
    isCustomTrack: boolean = false,
    customQuestionIds?: number[]
  ) => {
    const newSession: InterviewSession = {
      studentName: name,
      targetRole: role,
      targetCompany: company,
      currentQuestionIndex: 0,
      answers: {},
      evaluations: {},
      isFinished: false,
      overallReport: null,
      isCustomTrack,
      customQuestionIds,
    };
    setSession(newSession);
    setUserAnswer("");
    setElapsedSeconds(0);
    setApiError(null);
    setActiveTab(-1);
  };

  // Start/Stop Timer based on session activity
  useEffect(() => {
    if (session && !session.isFinished && !isEvaluating && activeTab === -1) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session, isEvaluating, activeTab]);

  // Restart Timer when moving to a new active question
  const resetQuestionTimer = () => {
    setElapsedSeconds(0);
  };

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setUserAnswer((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + finalTranscript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Speech Recognition toggler
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice dictation is not fully supported on this browser or environment.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Submitting an answer to the backend
  const handleSubmitAnswer = async () => {
    if (!session || isEvaluating) return;
    if (!userAnswer.trim()) {
      alert("Please enter or dictate an answer first!");
      return;
    }

    // Stop listening if recording
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setApiError(null);

    const activeQuestion = sessionQuestions[session.currentQuestionIndex];

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionNumber: activeQuestion.id,
          questionText: activeQuestion.text,
          userAnswer: userAnswer,
          studentName: session.studentName,
          targetRole: session.targetRole,
          targetCompany: session.targetCompany,
        }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation endpoint failed with status: ${response.status}`);
      }

      const evaluation: QuestionEvaluation = await response.json();

      setSession((prev) => {
        if (!prev) return null;
        const updatedAnswers = { ...prev.answers, [prev.currentQuestionIndex]: userAnswer };
        const updatedEvaluations = { ...prev.evaluations, [prev.currentQuestionIndex]: evaluation };
        return {
          ...prev,
          answers: updatedAnswers,
          evaluations: updatedEvaluations,
        };
      });
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong evaluating your response. Please check your connections and try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Advancing to the next question or triggering final evaluation
  const handleNextQuestion = async () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex < sessionQuestions.length) {
      // Move to next question
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
        };
      });
      setUserAnswer("");
      resetQuestionTimer();
      setActiveTab(-1);
    } else {
      // Last question completed! Let's build the overall report card.
      setIsEvaluating(true);
      setApiError(null);

      try {
        const evaluationsList = Object.values(session.evaluations);
        const response = await fetch("/api/evaluate-overall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: session.studentName,
            targetRole: session.targetRole,
            targetCompany: session.targetCompany,
            evaluations: evaluationsList,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate final placement readiness summary.");
        }

        const report: OverallReport = await response.json();

        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            isFinished: true,
            overallReport: report,
          };
        });
      } catch (err: any) {
        console.error(err);
        setApiError(err.message || "Failed to process overall report. Please retry.");
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  // Format Elapsed Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Word count helper
  const wordCount = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // Main UI render
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col antialiased">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-600/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-base text-slate-800 leading-tight">
                Smart Interview Coach AI
              </h1>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                CAMPUS RECRUITMENT SIMULATOR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="dev-test-suite-toggle-button"
              onClick={() => setShowTestSuite((prev) => !prev)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all border flex items-center gap-1.5 ${
                showTestSuite
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-inner"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-xs"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{showTestSuite ? "Exit Test Suite" : "Dev Test Suite"}</span>
            </button>

            {session && !session.isFinished && (
              <div className="flex items-center gap-3 text-xs border-l border-slate-150 pl-3">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-slate-700">{session.studentName}</p>
                  <p className="text-[10px] text-slate-400">
                    Prep: <span className="text-indigo-600 font-medium">{session.targetRole}</span> @ {session.targetCompany}
                  </p>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to quit this session and reset?")) {
                      setSession(null);
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  Quit Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {showTestSuite ? (
          <TestSuite 
            onClose={() => setShowTestSuite(false)} 
            studentName={session?.studentName || "Test Candidate"}
            targetRole={session?.targetRole || "Software Engineer"}
            targetCompany={session?.targetCompany || "Google"}
          />
        ) : !session ? (
          <WelcomeScreen onStart={handleStartSession} />
        ) : session.isFinished && session.overallReport ? (
          <FinalReportScreen
            studentName={session.studentName}
            targetRole={session.targetRole}
            targetCompany={session.targetCompany}
            evaluations={session.evaluations}
            report={session.overallReport}
            onRestart={() => setSession(null)}
            onSelectQuestion={(idx) => {
              // Load historical evaluation for review
              setActiveTab(idx);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar check list */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-[calc(100vh-140px)] min-h-[450px]">
              <SidebarQuestions
                currentIndex={session.currentQuestionIndex}
                evaluations={session.evaluations}
                onQuestionSelect={(idx) => {
                  setActiveTab(idx);
                }}
                questions={sessionQuestions}
              />
            </div>

            {/* Active Workspace / Content */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab !== -1 ? (
                // Past Question Review Mode
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex gap-2 items-start">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-amber-900">
                          Review Mode: Question #{activeTab + 1}
                        </h4>
                        <p className="text-xs text-amber-700/80">
                          You are viewing previous coach feedback for: "{sessionQuestions[activeTab].text}"
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab(-1)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      Return to Active Question
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono block">YOUR ORIGINAL RESPONSE</span>
                    <p className="text-xs italic text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                      "{session.answers[activeTab]}"
                    </p>
                  </div>

                  {session.evaluations[activeTab] && (
                    <EvaluationCard evaluation={session.evaluations[activeTab]} />
                  )}
                </div>
              ) : (
                // Active Interview Question Mode
                <div className="space-y-6">
                  {/* Active Question Box */}
                  <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                        Question {session.currentQuestionIndex + 1} of {sessionQuestions.length} • {sessionQuestions[session.currentQuestionIndex].category}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Timer: {formatTime(elapsedSeconds)}</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-sans font-bold text-slate-800 leading-snug">
                      {sessionQuestions[session.currentQuestionIndex].text}
                    </h2>

                    {/* Hint Component */}
                    <div className="mt-4 pt-4 border-t border-slate-100/80">
                      <details className="group">
                        <summary className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer select-none flex items-center gap-1 list-none">
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                          💡 Need a hint or answering outline?
                        </summary>
                        <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-indigo-50/20 border border-indigo-100/50 rounded-lg p-3 italic">
                          {sessionQuestions[session.currentQuestionIndex].hint || "Structure your response logically, use bullet points if speaking, and cite concrete examples."}
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Input Form & Speech-to-Text */}
                  <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor="student-answer-textarea" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Your Professional Response
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleListening}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all ${
                            isListening
                              ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse font-semibold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title="Record using Speech-To-Text Dictation"
                        >
                          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          <span>{isListening ? "Listening..." : "Dictate Response"}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {wordCount(userAnswer)} words
                        </span>
                      </div>
                    </div>

                    <textarea
                      id="student-answer-textarea"
                      rows={5}
                      placeholder={
                        isListening
                          ? "Listening to your voice... Speak clearly into your microphone."
                          : "Type your detailed interview answer here. You can also click the microphone to dictate your response!"
                      }
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={isEvaluating}
                      className="w-full text-sm p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 font-sans leading-relaxed transition-all resize-y"
                    />

                    {apiError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Evaluation Error</p>
                          <p>{apiError}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={isEvaluating || !userAnswer.trim()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing Response...
                          </>
                        ) : (
                          <>
                            Submit to Coach
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Evaluating Loading placeholder */}
                  {isEvaluating && (
                    <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute h-12 w-12 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Reviewing your placement response...</h4>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                          Coach is analyzing sentence structures, grammar accuracy, confidence attributes, and preparing professional alternatives.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show Current Question Evaluation Feedback */}
                  {session.evaluations[session.currentQuestionIndex] && !isEvaluating && (
                    <div className="space-y-4">
                      <EvaluationCard evaluation={session.evaluations[session.currentQuestionIndex]} />

                      <div className="flex justify-center pt-2">
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20"
                        >
                          {session.currentQuestionIndex === sessionQuestions.length - 1 ? (
                            <>
                              Finish and Get Overall Report Card
                              <Award className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Advance to Question {session.currentQuestionIndex + 2}
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Smart Interview Coach AI. Engineered for college career success.</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Model: <strong className="text-slate-500">gemini-3.5-flash</strong></span>
            <span>Version: <strong className="text-slate-500">v2.1.0</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
