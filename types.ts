export interface QuestionEvaluation {
  questionNumber: number;
  questionText: string;
  userAnswer: string;
  scores: {
    grammar: number;
    confidence: number;
    communication: number;
    technicalAccuracy: number | null; // Can be null if not a technical question
  };
  strengths: string[];
  areasToImprove: string[];
  betterAnswer: string;
  interviewTip: string;
  motivation: string;
  // If answered in Tamil, we provide additional fields
  isTamil?: boolean;
  tamilFeedback?: {
    simpleTamilExplanation: string;
    englishCorrectedAnswer: string;
  };
  // If grammar errors are present, detailed explanations are provided
  grammarCorrections?: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  // The exact formatted string response as requested by the user instructions
  rawMarkdownText?: string;
}

export interface OverallReport {
  overallScore: number;
  strengths: string[];
  improvementAreas: string[];
  sevenDayPlan: {
    day: string; // e.g. "Day 1: Resume & Tell me about yourself"
    objective: string;
    tasks: string[];
  }[];
}

export interface InterviewSession {
  studentName: string;
  targetRole: string;
  targetCompany: string;
  currentQuestionIndex: number; 
  answers: { [key: number]: string };
  evaluations: { [key: number]: QuestionEvaluation };
  isFinished: boolean;
  overallReport: OverallReport | null;
  // Dynamic fields to handle custom/practice tracks
  isCustomTrack?: boolean;
  customQuestionIds?: number[]; 
}

export interface Question {
  id: number;
  text: string;
  category: 
    | "General" 
    | "Technical (Python)" 
    | "Technical (SQL)" 
    | "Technical (Data Analytics)" 
    | "Technical (Excel)" 
    | "Technical (Power BI)" 
    | "Behavioral" 
    | "HR" 
    | "Situational";
  difficulty: "Easy" | "Medium" | "Hard";
  hint: string;
}

// Original 14 questions representing the standard tracker
export const INTERVIEW_QUESTIONS = [
  { id: 1, text: "Tell me about yourself.", category: "General" as const, difficulty: "Easy" as const, hint: "Structure using 'Present-Past-Future'. Start with your current engineering/placement stage, highlight 1 key project or skill, and state why you are excited for this interview." },
  { id: 2, text: "Why should we hire you?", category: "General" as const, difficulty: "Easy" as const, hint: "Map your unique skills directly to the job description. Mention your quick learning ability and express how your academic training solves their engineering challenges." },
  { id: 3, text: "What are your strengths?", category: "General" as const, difficulty: "Easy" as const, hint: "Name 1-2 traits (e.g., analytical thinking, proactive problem solving) and back them up with a mini-example from your project or lab work." },
  { id: 4, text: "What are your weaknesses?", category: "General" as const, difficulty: "Easy" as const, hint: "Pick a real but non-critical skill gap (e.g., public speaking, overthinking details) and explain the concrete steps you are currently taking to overcome it." },
  { id: 5, text: "Why do you want to join our company?", category: "General" as const, difficulty: "Medium" as const, hint: "Align your personal career goals with the company's recent achievements, core values, or culture. Show that you have researched their work!" },
  { id: 6, text: "Where do you see yourself in 5 years?", category: "General" as const, difficulty: "Medium" as const, hint: "Emphasize stability and growth. Express a desire to master your technical role first and eventually transition to leading projects or mentoring juniors." },
  { id: 7, text: "Explain one academic project.", category: "Behavioral" as const, difficulty: "Medium" as const, hint: "Explain using the STAR method. State the objective, the technologies used (Python/React/etc.), your individual contribution, and the final outcome or metric." },
  { id: 8, text: "What are some Python basics (e.g., data types, lists, dictionaries, or loops)?", category: "Technical (Python)" as const, difficulty: "Easy" as const, hint: "Demonstrate clear concepts: explain data structures (lists vs. tuples), loops, list comprehensions, or key built-in modules you've applied." },
  { id: 9, text: "Can you explain some SQL basics (e.g., SELECT, JOINs, GROUP BY, or subqueries)?", category: "Technical (SQL)" as const, difficulty: "Easy" as const, hint: "Explain relational concepts. Mention JOIN types, GROUP BY filtering (HAVING), aggregate functions, and write a simple mental SELECT statement." },
  { id: 10, text: "What are the core stages/concepts in Data Analytics basics?", category: "Technical (Data Analytics)" as const, difficulty: "Easy" as const, hint: "Walk through the pipeline: Data collection, data cleaning (handling missing values), exploratory data analysis (EDA), and storytelling with charts." },
  { id: 11, text: "Explain some essential Excel basics for data sorting and formulas.", category: "Technical (Excel)" as const, difficulty: "Easy" as const, hint: "Mention logical/lookup formulas (VLOOKUP, XLOOKUP, IF), pivot tables, data sorting, and filters you use to organize unstructured data." },
  { id: 12, text: "What are Power BI basics (e.g., DAX, visualizations, or data cleaning)?", category: "Technical (Power BI)" as const, difficulty: "Easy" as const, hint: "Describe connecting data sources, shaping data in Power Query, building Star Schemas, and creating interactive visualization tiles with custom DAX fields." },
  { id: 13, text: "Let's do an HR round question: 'How do you handle conflict or work pressure?'", category: "HR" as const, difficulty: "Medium" as const, hint: "Describe a time you had multiple lab deadlines or project delays. Explain how you prioritized tasks, communicated with teammates, and maintained calm." },
  { id: 14, text: "Here is a situation-based question: 'Tell me about a time you worked in a team and faced a major obstacle. How did you resolve it?'", category: "Situational" as const, difficulty: "Hard" as const, hint: "Share a group obstacle. Focus on how you proactively communicated, resolved internal team friction, adjusted goals, and safely delivered the project." }
];

// Expanded comprehensive question bank containing 10+ questions for each category
export const QUESTION_BANK: Question[] = [
  // --- TECHNICAL (PYTHON) ---
  {
    id: 101,
    text: "What are the key differences between Lists and Tuples in Python?",
    category: "Technical (Python)",
    difficulty: "Easy",
    hint: "Explain mutability vs immutability, syntax difference (brackets vs parentheses), memory efficiency, and appropriate use cases for each."
  },
  {
    id: 102,
    text: "How does exception handling work in Python? Explain try-except-finally blocks.",
    category: "Technical (Python)",
    difficulty: "Easy",
    hint: "Describe the execution flow, how finally always executes, and the importance of catching specific exceptions instead of using bare except."
  },
  {
    id: 103,
    text: "Explain list comprehensions in Python and write a simple example.",
    category: "Technical (Python)",
    difficulty: "Medium",
    hint: "Describe list comprehension as a concise way to create lists. Give an example like [x**2 for x in range(10) if x % 2 == 0] and show its equivalence to a standard for loop."
  },
  {
    id: 104,
    text: "What is the difference between a shallow copy and a deep copy in Python's copy module?",
    category: "Technical (Python)",
    difficulty: "Medium",
    hint: "Explain how shallow copies only duplicate references to nested objects, whereas deep copies recursively copy all nested objects, preventing side effects."
  },
  {
    id: 105,
    text: "What are Python Decorators and how do they modify function behavior?",
    category: "Technical (Python)",
    difficulty: "Medium",
    hint: "Explain how a decorator takes a function as an argument, wraps its behavior, and returns a new function. Use a logging or timing decorator as an example."
  },
  {
    id: 106,
    text: "How does Python handle memory management and garbage collection?",
    category: "Technical (Python)",
    difficulty: "Medium",
    hint: "Mention reference counting, cyclic reference detection, and the role of the 'gc' module in cleaning up objects that can no longer be reached."
  },
  {
    id: 107,
    text: "Explain the Global Interpreter Lock (GIL) and its impact on multi-threaded Python applications.",
    category: "Technical (Python)",
    difficulty: "Hard",
    hint: "Explain that the GIL permits only one thread to execute Python bytecode at a time, making standard multithreading ineffective for CPU-bound tasks, but suitable for I/O-bound tasks."
  },
  {
    id: 108,
    text: "What are Generators and 'yield' statements in Python? How do they improve memory usage?",
    category: "Technical (Python)",
    difficulty: "Hard",
    hint: "Describe generators as functions that return an iterator yielding one item at a time. Highlight that they compute values lazily, which is critical for handling massive files."
  },
  {
    id: 109,
    text: "Explain the difference between __init__ and __new__ in Python Object-Oriented programming.",
    category: "Technical (Python)",
    difficulty: "Hard",
    hint: "__new__ is the actual creator of the instance (static method), whereas __init__ is the initializer that configures attributes on the newly created object."
  },
  {
    id: 110,
    text: "How do *args and **kwargs work in Python function signatures?",
    category: "Technical (Python)",
    difficulty: "Easy",
    hint: "Explain that *args allows passing a variable number of positional arguments (as a tuple) and **kwargs allows variable keyword arguments (as a dictionary)."
  },

  // --- TECHNICAL (SQL) ---
  {
    id: 201,
    text: "What is the difference between WHERE and HAVING clauses in SQL?",
    category: "Technical (SQL)",
    difficulty: "Easy",
    hint: "WHERE filters rows before aggregation/grouping, while HAVING filters grouped results after aggregation."
  },
  {
    id: 202,
    text: "Explain INNER JOIN, LEFT JOIN, and RIGHT JOIN with illustrative concepts.",
    category: "Technical (SQL)",
    difficulty: "Easy",
    hint: "Explain with table visual intersections: INNER gets matching rows, LEFT gets all rows from left table plus matched rows, RIGHT does the opposite."
  },
  {
    id: 203,
    text: "What are Primary Keys and Foreign Keys, and why are they vital to database design?",
    category: "Technical (SQL)",
    difficulty: "Easy",
    hint: "Primary key uniquely identifies rows in a table. Foreign key establishes a relational link pointing to a primary key in another table, maintaining referential integrity."
  },
  {
    id: 204,
    text: "What is a subquery? Contrast correlated subqueries with non-correlated subqueries.",
    category: "Technical (SQL)",
    difficulty: "Medium",
    hint: "Non-correlated subquery runs independently of the outer query. Correlated subquery relies on outer query values for its evaluations, running once per row evaluated."
  },
  {
    id: 205,
    text: "Explain SQL GROUP BY and aggregate functions like SUM, AVG, COUNT, and MAX.",
    category: "Technical (SQL)",
    difficulty: "Easy",
    hint: "Explain how GROUP BY collates identical data rows into summary blocks so aggregate calculations can run over each individual block."
  },
  {
    id: 206,
    text: "What are SQL Window Functions? Explain ROW_NUMBER, RANK, and DENSE_RANK.",
    category: "Technical (SQL)",
    difficulty: "Medium",
    hint: "Explain how OVER() partition blocks work. Contrast RANK (skips rank numbers on ties) with DENSE_RANK (never skips numbers on ties)."
  },
  {
    id: 207,
    text: "What is database normalization? Explain the rules for 1NF, 2NF, and 3NF.",
    category: "Technical (SQL)",
    difficulty: "Medium",
    hint: "1NF removes duplicate columns and multi-values. 2NF removes partial dependencies on composite keys. 3NF removes transitive dependencies."
  },
  {
    id: 208,
    text: "What are Database Indexes? Contrast B-Tree indexes with Hash indexes.",
    category: "Technical (SQL)",
    difficulty: "Hard",
    hint: "Indexes act as lookup maps for tables. B-Tree is excellent for range queries (e.g. >, <, BETWEEN) and ordering, whereas Hash indexes are highly efficient only for exact matches."
  },
  {
    id: 209,
    text: "Explain SQL Database Transactions and the core ACID properties.",
    category: "Technical (SQL)",
    difficulty: "Hard",
    hint: "Describe ACID: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrency control), and Durability (permanent saves)."
  },
  {
    id: 210,
    text: "How do you identify and resolve slow database queries in production?",
    category: "Technical (SQL)",
    difficulty: "Hard",
    hint: "Mention using 'EXPLAIN ANALYZE' to check execution plans, adding appropriate column indexing, removing unneeded subqueries, or performing query caching."
  },

  // --- TECHNICAL (DATA ANALYTICS) ---
  {
    id: 301,
    text: "What are the core steps of a professional Data Analysis workflow?",
    category: "Technical (Data Analytics)",
    difficulty: "Easy",
    hint: "Define the structure: 1) Defining requirements, 2) Data collection, 3) Data cleaning, 4) Exploratory analysis (EDA), 5) Statistical modeling/testing, and 6) Reporting/storytelling."
  },
  {
    id: 302,
    text: "What is the difference between Qualitative and Quantitative data?",
    category: "Technical (Data Analytics)",
    difficulty: "Easy",
    hint: "Quantitative data is numerical, measurable, and continuous/discrete (e.g., price). Qualitative data is categorical, descriptive, and conceptual (e.g., feedback sentiment)."
  },
  {
    id: 303,
    text: "How do you systematically handle missing or null values in a dataset?",
    category: "Technical (Data Analytics)",
    difficulty: "Easy",
    hint: "List major methods: deletion (listwise), imputation using statistical measures (mean, median, mode), or advanced forward/backward fill algorithms for time series."
  },
  {
    id: 304,
    text: "What is Exploratory Data Analysis (EDA) and why is it essential?",
    category: "Technical (Data Analytics)",
    difficulty: "Medium",
    hint: "EDA uses statistical summaries and visualizations (box plots, histograms) to understand data distribution, spot anomalies, and form hypotheses before modeling."
  },
  {
    id: 305,
    text: "Explain the difference between Correlation and Causation with an example.",
    category: "Technical (Data Analytics)",
    difficulty: "Medium",
    hint: "Correlation is a statistical measure of mutual association. Causation indicates that one event directly triggers the other. Give a funny example like ice cream sales and sunburns."
  },
  {
    id: 306,
    text: "Explain what A/B Testing is and how hypothesis testing is applied.",
    category: "Technical (Data Analytics)",
    difficulty: "Medium",
    hint: "Explain split-testing control groups (A) vs variants (B). Discuss calculating a p-value to reject the null hypothesis and confirm statistical significance."
  },
  {
    id: 307,
    text: "What are Outliers, and how do they impact models? How do you detect them?",
    category: "Technical (Data Analytics)",
    difficulty: "Medium",
    hint: "Outliers are extreme data points. They skew statistical metrics like the mean. Detect them via Z-score metrics, IQR methods (Interquartile Range), or scatter plots."
  },
  {
    id: 308,
    text: "Explain the Central Limit Theorem (CLT) and its critical importance in statistics.",
    category: "Technical (Data Analytics)",
    difficulty: "Hard",
    hint: "Explain that as sample sizes grow large, the distribution of sample means approaches a normal bell-curve, allowing us to perform parametric tests on non-normal distributions."
  },
  {
    id: 309,
    text: "What is overfitting in predictive analytics, and how can you detect and prevent it?",
    category: "Technical (Data Analytics)",
    difficulty: "Hard",
    hint: "Overfitting is when a model learns noise instead of signal. Detect it via validation set deviations. Prevent it via cross-validation, regularization, or simpler structures."
  },
  {
    id: 310,
    text: "Explain a Confusion Matrix. What is the difference between Precision and Recall?",
    category: "Technical (Data Analytics)",
    difficulty: "Hard",
    hint: "Matrix tracks TP, TN, FP, FN. Precision evaluates out of predicted positives, how many are actual positives. Recall evaluates out of actual positives, how many we successfully caught."
  },

  // --- TECHNICAL (EXCEL) ---
  {
    id: 401,
    text: "How do VLOOKUP and XLOOKUP differ, and why is XLOOKUP vastly superior?",
    category: "Technical (Excel)",
    difficulty: "Easy",
    hint: "XLOOKUP searches both left and right, doesn't break when columns are inserted, defaults to an exact match, and handles missing cases without nesting IFERROR."
  },
  {
    id: 402,
    text: "What is an Excel Pivot Table, and how do you use it for summary reporting?",
    category: "Technical (Excel)",
    difficulty: "Easy",
    hint: "Explain that Pivot Tables dynamically group, sort, and aggregate transactional datasets to reveal patterns, sums, and averages across multiple dimensions."
  },
  {
    id: 403,
    text: "What are some essential keyboard shortcuts and built-in formulas you use daily?",
    category: "Technical (Excel)",
    difficulty: "Easy",
    hint: "Cite formulas like SUMIFS, COUNTIFS, and shortcuts like Ctrl+Shift+L (Filters), Alt+H+O+I (Autofit column width), or F4 (Toggle absolute cell reference)."
  },
  {
    id: 404,
    text: "How do INDEX and MATCH functions work together as an alternative to VLOOKUP?",
    category: "Technical (Excel)",
    difficulty: "Medium",
    hint: "MATCH finds the relative row/column index of a search item. INDEX returns the value of a cell at that specific intersection, allowing safer and faster lookups."
  },
  {
    id: 405,
    text: "What is Conditional Formatting, and how can you use it to highlight outliers?",
    category: "Technical (Excel)",
    difficulty: "Easy",
    hint: "Explain applying visual formatting rules to cells based on their values. Highlight using formula-based conditional rules to color values > 3 standard deviations."
  },
  {
    id: 406,
    text: "Explain how to nest IF statements with logical AND and OR operators in Excel.",
    category: "Technical (Excel)",
    difficulty: "Medium",
    hint: "Show the syntax: =IF(AND(A1>50, B1=\"Pass\"), \"Approved\", \"Rejected\") and explain how nested functions validate complex, multi-variable logic."
  },
  {
    id: 407,
    text: "What is Data Validation in Excel, and how does it prevent bad data entry?",
    category: "Technical (Excel)",
    difficulty: "Easy",
    hint: "Data validation restricts inputs to predefined formats (e.g. date ranges, whole numbers, custom dropdown lists), protecting raw spreadsheets from user errors."
  },
  {
    id: 408,
    text: "What is Excel Power Query, and how do you use it for Extract, Transform, Load (ETL) tasks?",
    category: "Technical (Excel)",
    difficulty: "Hard",
    hint: "Power Query acts as an automated data processing panel: it merges files from folders, splits columns, handles nulls, and records cleaning steps for future automation."
  },
  {
    id: 409,
    text: "Explain how to write a simple VBA macro or use Office Scripts to automate spreadsheets.",
    category: "Technical (Excel)",
    difficulty: "Hard",
    hint: "Describe recording steps with Macro Recorder, editing them in the VBA editor using modules, or writing modern typescript-based Office Scripts to run over cloud sheets."
  },
  {
    id: 410,
    text: "How do you use Solver and Goal Seek utilities in Excel for mathematical forecasting?",
    category: "Technical (Excel)",
    difficulty: "Hard",
    hint: "Goal Seek works backward to find a single variable value needed to meet a target. Solver is an optimization engine that adjusts multiple variables while respecting custom constraints."
  },

  // --- TECHNICAL (POWER BI) ---
  {
    id: 501,
    text: "What is DAX (Data Analysis Expressions), and how does it differ from standard Excel formulas?",
    category: "Technical (Power BI)",
    difficulty: "Easy",
    hint: "DAX works over relational tables and models using filter contexts, whereas Excel formulas primarily operate directly on cell references, coordinates, and continuous ranges."
  },
  {
    id: 502,
    text: "What is the difference between a Calculated Column and a Measure in Power BI?",
    category: "Technical (Power BI)",
    difficulty: "Medium",
    hint: "Calculated columns are pre-computed row-by-row during data refresh, occupying disk/RAM space. Measures are computed dynamically on the fly based on visual filter selections."
  },
  {
    id: 503,
    text: "What are the primary interactive visualizations available in Power BI Desktop?",
    category: "Technical (Power BI)",
    difficulty: "Easy",
    hint: "Mention Bar Charts (aggregated counts), Treemaps (nested proportions), Cards (KPI highlights), Slicers (filters), Matrix tables, and interactive Maps."
  },
  {
    id: 504,
    text: "Explain the differences between Import, DirectQuery, and Live Connection storage modes.",
    category: "Technical (Power BI)",
    difficulty: "Medium",
    hint: "Import loads data directly into Power BI RAM (fastest performance). DirectQuery queries the underlying source database in real-time. Live Connection links directly to an Analysis Services cube."
  },
  {
    id: 505,
    text: "What is Power Query in Power BI, and how do you perform data profiling and shape data?",
    category: "Technical (Power BI)",
    difficulty: "Easy",
    hint: "Power Query transforms data prior to modeling. Profiling tools (Column quality, Column distribution) let you check error percentages and empty values visually."
  },
  {
    id: 506,
    text: "What is a Star Schema, and why is it recommended for Power BI modeling over Snowflake schemas?",
    category: "Technical (Power BI)",
    difficulty: "Medium",
    hint: "Star schema connects a central Fact Table (metrics) to single-layered Dimension Tables (attributes), simplifying relationships, accelerating filters, and optimizing RAM."
  },
  {
    id: 507,
    text: "How do you handle relationship directions (Active vs Inactive, Single vs Bi-directional) in data modeling?",
    category: "Technical (Power BI)",
    difficulty: "Medium",
    hint: "Active relationship is used for default filters. Inactive relationships can be activated via USERELATIONSHIP in DAX. Bi-directional filtering allows filters to flow both ways but can cause loops."
  },
  {
    id: 508,
    text: "Explain the CALCULATE function in DAX and how it alters filter contexts.",
    category: "Technical (Power BI)",
    difficulty: "Hard",
    hint: "CALCULATE is the master function. It evaluates an expression under modified, newly injected, or completely overridden filter contexts using arguments like FILTER or ALL."
  },
  {
    id: 509,
    text: "How do you configure Row-Level Security (RLS) in Power BI to restrict dashboard data access?",
    category: "Technical (Power BI)",
    difficulty: "Hard",
    hint: "Define security roles in Power BI Desktop using DAX filter expressions on tables (e.g. [Region] = \"North\"), then assign Azure AD users or groups to those roles in the service."
  },
  {
    id: 510,
    text: "What is Time Intelligence in DAX? How would you write a measure to calculate Year-Over-Year sales growth?",
    category: "Technical (Power BI)",
    difficulty: "Hard",
    hint: "Time intelligence handles date structures. Calculate YOY via: CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Calendar'[Date])) and find the percentage change."
  },

  // --- BEHAVIORAL ---
  {
    id: 601,
    text: "Tell me about a time you had to learn a complex new technology or tool in a short timeframe.",
    category: "Behavioral",
    difficulty: "Easy",
    hint: "Outline your learning strategy: breaking the tech into segments, reading documentations, building a sandbox trial, and how you delivered a successful college outcome."
  },
  {
    id: 602,
    text: "Describe a successful group academic project. What made the collaboration run smoothly?",
    category: "Behavioral",
    difficulty: "Easy",
    hint: "Discuss assignment of distinct technical roles, establish communication checkpoints, using GitHub for version control, and mutual code reviews."
  },
  {
    id: 603,
    text: "How do you handle critical feedback or code review corrections from a professor or teammate?",
    category: "Behavioral",
    difficulty: "Easy",
    hint: "Highlight your professional receptiveness. Explain separating personal feelings from project objectives, asking constructive questions, and implementing changes."
  },
  {
    id: 604,
    text: "Describe a situation where you had a major technical disagreement with a team member. How did you resolve it?",
    category: "Behavioral",
    difficulty: "Medium",
    hint: "Use STAR. Discuss hearing their perspective first, setting up a objective comparison test, consulting documentation, or agreeing on a compromised solution."
  },
  {
    id: 605,
    text: "Tell me about a time when you failed to meet a deadline or deliverable. What did you learn from the crisis?",
    category: "Behavioral",
    difficulty: "Medium",
    hint: "Be completely honest. Highlight the root cause (over-commitment or scope creep), how you proactively warned the stakeholder, delivered the item late, and what safeguard process you created."
  },
  {
    id: 606,
    text: "Describe a project where you took the initiative to go above and beyond the required rubric guidelines.",
    category: "Behavioral",
    difficulty: "Medium",
    hint: "Explain what triggered you to act (e.g., poor user experience), what extra feature you implemented (e.g. adding offline caching), and the final result or positive grade received."
  },
  {
    id: 607,
    text: "How do you systematically prioritize tasks when managing multiple close assignments and project milestones?",
    category: "Behavioral",
    difficulty: "Medium",
    hint: "Explain your organization structures: using Eisenhower matrices (urgent vs important), setting up micro-tasks in Trello, and coordinating with study teams."
  },
  {
    id: 608,
    text: "Tell me about a time when you had to work with highly vague or shifting requirements. How did you proceed?",
    category: "Behavioral",
    difficulty: "Hard",
    hint: "Describe initiating clarification meetings, building a rapid mockup or prototype to validate goals, documenting decisions, and adopting an agile sprint workflow."
  },
  {
    id: 609,
    text: "Describe a major mistake you made during an academic project that affected other teammates. How did you rectify it?",
    category: "Behavioral",
    difficulty: "Hard",
    hint: "Own the mistake immediately. Describe communicating transparently with the team, spending extra hours debugging the error, and creating regression test scripts."
  },
  {
    id: 610,
    text: "Tell me about a time you had to persuade a group or client to accept a technical solution they initially opposed.",
    category: "Behavioral",
    difficulty: "Hard",
    hint: "Explain using data-driven arguments, drawing comparisons with standard industry solutions, demonstrating a working prototype, and highlighting risk mitigation."
  },

  // --- HR ---
  {
    id: 701,
    text: "Why did you choose your specific major stream or engineering specialization?",
    category: "HR",
    difficulty: "Easy",
    hint: "Connect your choice to an early passion for technology, solving logical riddles, or a specific real-world system you wanted to understand."
  },
  {
    id: 702,
    text: "What are your primary hobbies and interests outside of your professional and academic life?",
    category: "HR",
    difficulty: "Easy",
    hint: "Be genuine. Choose activities that demonstrate teamwork, patience, problem solving, or continuous learning (e.g., sports, learning instruments, reading, gardening)."
  },
  {
    id: 703,
    text: "How would your close friends or project group peers describe you in three single words?",
    category: "HR",
    difficulty: "Easy",
    hint: "Choose descriptive, professional qualities (e.g. Dependable, Resourceful, Calming) and provide a one-sentence placement justification for each."
  },
  {
    id: 704,
    text: "Why do you want to join our company instead of other placement competitors on campus?",
    category: "HR",
    difficulty: "Medium",
    hint: "Express alignment with their projects, technical stack, learning culture, or an initiative of theirs you follow in tech news."
  },
  {
    id: 705,
    text: "How do you maintain focus and motivation when tasked with repetitive, mundane, or administrative tasks?",
    category: "HR",
    difficulty: "Medium",
    hint: "Explain that repetitive tasks build foundation. Describe automating parts of it using scripts, setting personal timers, and understanding how the task supports the wider team."
  },
  {
    id: 706,
    text: "Are you comfortable with professional relocation or working rotating shifts if required?",
    category: "HR",
    difficulty: "Easy",
    hint: "Express enthusiastic flexibility. State that as a starting engineer, your primary goal is to learn and adapt, which makes shift exposure highly valuable."
  },
  {
    id: 707,
    text: "What are your salary expectations for this entry-level placement position?",
    category: "HR",
    difficulty: "Medium",
    hint: "State that you are looking for a package aligned with standard industry packages for entry-level talent in this city. Emphasize that learning opportunities are your top priority."
  },
  {
    id: 708,
    text: "If you receive multiple job offers during placement season, what parameters will you use to make a decision?",
    category: "HR",
    difficulty: "Hard",
    hint: "Prioritize parameters: 1) Quality of mentorship and initial tech stack, 2) Growth opportunities inside the company, and 3) Alignment with your personal values."
  },
  {
    id: 709,
    text: "Where do you see your career evolving in the next 10 years? Do you plan on pursuing higher education like an MBA or MS?",
    category: "HR",
    difficulty: "Hard",
    hint: "State your goal is to master engineering first, transition into architecture or leadership, and that higher studies would only be pursued to solve specific industry challenges."
  },
  {
    id: 710,
    text: "What does professional ethics mean to you? How would you handle an unethical directive from a lead?",
    category: "HR",
    difficulty: "Hard",
    hint: "Ethics means maintaining transparency and compliance. If given an unethical task, seek clarification, document concerns, and utilize company compliance routes if unresolved."
  },

  // --- SITUATIONAL ---
  {
    id: 801,
    text: "What would you do if a team member stopped responding to calls and messages right before a major project submission?",
    category: "Situational",
    difficulty: "Easy",
    hint: "Ensure the team covers the immediate gap to secure the grade, document the work split, and gently approach the team member later to check on their wellness."
  },
  {
    id: 802,
    text: "How would you explain a highly complex technical database query to a completely non-technical client?",
    category: "Situational",
    difficulty: "Easy",
    hint: "Use real-world analogies (e.g. libraries and index cards), remove technical jargon like JOIN or B-Tree, and focus purely on the business outcome (speed, accuracy)."
  },
  {
    id: 803,
    text: "If your terminal or connection crashes during an online recruitment assessment, what immediate steps do you take?",
    category: "Situational",
    difficulty: "Easy",
    hint: "Stay calm. Document the crash with screenshots immediately, contact the placement cell or company support, try a backup hotspot connection, and resume quickly."
  },
  {
    id: 804,
    text: "If you find a critical data leak or security vulnerability in your group's repository, how do you handle it?",
    category: "Situational",
    difficulty: "Medium",
    hint: "Prioritize containment: patch or restrict the code, report immediately to the team leader/instructor, log the details, and run audits on surrounding files."
  },
  {
    id: 805,
    text: "How do you handle being assigned to a team project using a programming language or framework you have zero experience in?",
    category: "Situational",
    difficulty: "Medium",
    hint: "Acknowledge the learning curve. Set up a rapid 2-day sandbox learning plan, pair-program with experienced peers, take on simple modules first, and ramp up quickly."
  },
  {
    id: 806,
    text: "If a project manager assigns a feature to you that you know is physically impossible to complete by the deadline, how do you respond?",
    category: "Situational",
    difficulty: "Medium",
    hint: "Don't just say 'no'. Present a detailed breakdown of estimated times, offer alternative scopes (e.g. core feature first, secondary items later), and ask for priority guidelines."
  },
  {
    id: 807,
    text: "You are in a live client presentation and are asked a technical question to which you do not know the answer. How do you handle it?",
    category: "Situational",
    difficulty: "Medium",
    hint: "Never guess or lie. Acknowledge the question as highly insightful, state your current understanding, and promise to follow up with exact specifications within 24 hours."
  },
  {
    id: 808,
    text: "A production database goes offline, and the team lead is completely unreachable. What is your immediate crisis strategy?",
    category: "Situational",
    difficulty: "Hard",
    hint: "Check log metrics to verify the scale, coordinate with other senior devs to isolate the error, rollback recent deployments if needed, and communicate progress clearly."
  },
  {
    id: 809,
    text: "You discover that another student has directly copied major components of your academic project code. How do you resolve this conflict?",
    category: "Situational",
    difficulty: "Hard",
    hint: "Approach the peer calmly and privately. Ask them to write their own implementation to protect both of you from plagiarism rules, and consult your mentor if they refuse."
  },
  {
    id: 810,
    text: "If you are given two high-priority tasks by two different senior executives, both due at the end of the day, how do you resolve the conflict?",
    category: "Situational",
    difficulty: "Hard",
    hint: "Bring both executives or your direct manager into a quick combined message. Present the clear estimated hours for each task, explain the conflict, and let them align on final priorities."
  }
];
