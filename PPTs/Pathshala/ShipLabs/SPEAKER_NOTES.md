# ShipLabs: Speaker Notes

One script per step, read aloud while presenting. The same text appears live in the presenter window (press `N`).

## Introduction

### 1. ShipLabs · ~1 min

1. **Welcome.** Good morning everyone. We are team Indie Hub, and our major project is called ShipLabs. It is an AI tutor that does three things. It teaches you, it checks your answers, and it coaches you while you build real projects, even inside your own code editor. Let's begin.

### 2. The Road Map · ~2 min

1. **Part A · The Idea.** Here is the plan for today. Part A is the idea. What problem we are solving, who it is for, and how the whole system is put together.
2. **Part B · Teach & Trust.** Part B is about teaching and trust. How the tutor teaches step by step, how answers are graded by code and not by the AI, and how every fact is checked before you see it.
3. **Part C · Build & Ship.** Part C is where we build and ship. Project labs, and the VS Code extension that watches your work and reviews it like a lab instructor. Then security, resilience and the build timeline.

## Part A · The Idea

### 3. The Problem · ~3 min

1. **Answers without teaching.** Students today have more content than ever. But content is not teaching. A normal AI chatbot gives you a wall of text. It never checks if you understood. And sometimes it says something wrong, with full confidence.
2. **No feedback, and fast forgetting.** Second, there is no feedback loop. A video or a PDF can't tell you which part you got right and which part you got wrong. Third, forgetting. You learn a topic today, and in a week most of it is gone, because nothing brings it back at the right time.
3. **Watching is not doing.** Fourth, watching code is not the same as writing code. Real skill comes from getting stuck and having someone look over your shoulder. Bootcamps do that, but they are expensive. And fifth, one size fits all. A Class 8 student, a JEE student and a working developer need very different depth and language.
4. **The gap.** So here is the gap in one line. Content is everywhere. Teaching isn't. ShipLabs is built to close that gap.

### 4. What the System Must Guarantee · ~2 min

1. **Trust and feedback.** Each pain becomes a hard rule for the system. Wrong answers means every risky fact, quiz key and link must be checked first. No feedback means answers are graded, and graded by code wherever possible. Forgetting means every mastered topic gets a review date.
2. **Practice, fit and fairness.** Passive coding means real labs, with a live instructor inside your own editor. One size fits all means a learner profile that shapes the syllabus and the tone. And one rule people forget: nobody should be able to farm points. So points are awarded once, capped, and the AI can never hand them out by itself.

### 5. Meet ShipLabs · ~3 min

1. **Chat.** ShipLabs is one tutor with four ways to learn. The first is Chat. You ask anything, and you get a clear answer, with diagrams, real photos and source links that were checked to actually exist.
2. **Tutor.** The second is Tutor. This is a full course on one topic. It teaches, asks a question, grades your answer and gives points. When you score 65, you have mastered that part and it moves you forward.
3. **Coach.** The third is Coach. You say what you want to build, for example a REST API in Go. It designs a full project, split into steps, each with clear instructions and a rubric. You write the code, and it reviews it like a senior engineer.
4. **ShipLabs for VS Code.** And the fourth is the superpower, the ShipLabs extension for VS Code. It brings the lab into your own editor. It watches your work, reviews it a few seconds after you pause, writes hint comments in your file, and can even run your code. But it never writes your code for you.
5. **One rule behind it all.** Around these sit reviews, XP and ranks, documents, sharing and lab reports. And one rule runs through the whole project. The AI writes, the code decides. The AI writes explanations and questions. But grading, points, moving forward, credits and every write to your files are decided by normal, testable code.

### 6. Who It's For · ~3 min

1. **Riya · Class 9, CBSE.** Let me show four learners. Riya is in Class 9, CBSE, Hindi medium. She asks: explain photosynthesis with a diagram. ShipLabs draws the diagram for her, in code, at her level.
2. **Arjun · JEE aspirant.** Arjun is preparing for JEE Main. ShipLabs searches for the current official syllabus, checks the sources, and builds his course from it. Not from old memory.
3. **Meera · B.Com.** Meera studies commerce. She uploads her own notes as a PDF. ShipLabs reads every page, even scanned ones, and turns her notes into a course.
4. **Kabir · developer.** And Kabir is a self-taught developer. He says: build a REST API in Go. He gets a full project, and ShipLabs reviews his code right inside VS Code. One teacher, adapted to the level, the goal and the language of each learner.

### 7. System Architecture · ~4 min

1. **Three places code runs.** Here is the whole system on one screen. Code runs in three places. The website, built with Next.js and served from Cloudflare Pages. The API server, built with Node and Express, on our own server behind a Cloudflare Tunnel. And the VS Code extension, on the learner's own laptop.
2. **Two kinds of key.** Both clients talk to one API. The browser sends a login token from Clerk, called a JWT. VS Code sends its own key that starts with s-l-x underscore. Same account, but the editor key only works for lab routes.
3. **Gates before any AI.** Inside the API, every request passes three gates. First, who are you. Second, the rate limit. Third, the route. Only then do the services run: grading, verification, documents, images, syllabus, reviews and reports.
4. **A dedicated AI chain.** When the AI is needed, the API calls our own provider chain. First our in-house model, called MADHAVA. If that fails, a second hosted model. And a final fallback that is always on. More on this later.
5. **Saved, then answered.** Finally the answer goes back to the learner, and everything is saved in MongoDB: chats, labs, reviews and editor activity.

### 8. Tech Stack · ~2 min

1. **Six layers.** Here is the tech stack from the bottom up. MongoDB for flexible documents. Node and Express for one API with all the logic. Our AI provider chain for reliability. Server-Sent Events so text streams live. Next.js and React for a fast website. And the VS Code extension API to live inside the editor.
2. **Around the core.** Around the core: Clerk for login on the web, and our own tokens for VS Code. Cloudflare for hosting. Uploads are parsed in memory and never written to disk. Charts are drawn, not generated. Photos come from free licensed sources. And everything is tested with Jest and Playwright.

### 9. Data Model · ~3 min

1. **Sessions hold chats.** Now the data. A session is just a folder in the sidebar. Inside it are chats, and every chat has a mode: chat, tutor or coach.
2. **Tutor chats carry state.** A tutor chat also remembers who you are, your profile. It keeps your points out of 100, the pathway of sub-topics, and the question being asked right now.
3. **Labs, reviews and the editor.** A coach chat holds a lab with its steps, and each step has a status. Separately, we store review cards for spaced repetition, every event from VS Code, and the single key for your connected editor.

## Part B · Teach & Trust

### 10. Answers That Stream Live · ~3 min

1. **One question, one credit.** Let's follow one question. The learner asks: how does photosynthesis work? Before anything else, the server checks the learner's credits and takes one. If there are not enough, it stops right there.
2. **Words arrive live.** Then a pipe opens. The answer arrives word by word, already formatted, with headings and bold words. Every 10 seconds a small heartbeat keeps the connection alive, even through proxies.
3. **Extras, then done.** When the text ends, the extras arrive as separate events: clickable options, a diagram, checked sources and a title for the chat. Then a done event stops the spinner. And if anything fails along the way, the credit is refunded automatically.

### 11. Unboxing Control Blocks · ~3 min

1. **Prose streams straight through.** How does the AI send buttons and diagrams without breaking the text? Think of a conveyor belt. Normal text passes straight through a gate and shows up in the chat right away.
2. **Sealed boxes are held and unboxed.** When the AI wants to attach something structured, it puts it in a sealed box with a special tag, like meraki choices. The gate drops and holds it. Even a half-written box is held, until the next chunk proves what it is. Then the server unboxes it and turns it into buttons.
3. **Leaked JSON is cut out.** Sometimes the AI leaks raw data into the text. The sanitizer catches it and cuts it out. It also removes repeated sentences. So the learner only ever sees clean text and buttons, never raw code noise.

### 12. Tutor: Getting to Know You · ~3 min

1. **A profile in a few taps.** Tutor mode starts by getting to know you. It asks only what it needs: your level, your goal, the exam if any, and the topic. You answer with one tap. Then the profile is locked. And if the AI forgets the topic, the server recovers it from your first message, so you never get a generic course.
2. **Three syllabus sources, in order.** Next, the syllabus. There is a strict order. If you attached a document, the course follows your document. If you named an exam, it searches for the current official syllabus. Otherwise a planner writes the sub-topics. And if even that fails, there is a safe fallback.
3. **A syllabus you can trust.** Exam syllabi change every year, so we never trust the AI's memory for them. We search the web, and at least one source must be a trusted, reachable page. Bad sources are dropped. The result fills the pathway on the right, with the first topic active.

### 13. The Tutor State Machine · ~3 min

1. **One path through a course.** The tutor is not a free-form chat. It is a state machine. Onboarding, then teaching, then a question is open, then grading, then mastered, and finally completed. Code decides which state you are in, not the AI.
2. **Loops that keep it honest.** Now the loops. If you ask for a hint, the question stays open. If you score below 65, you get feedback and a deeper reteach. If you say go to topic 3, the pointer moves first. And when you master a topic, the next one starts and a review is booked for later.

### 14. The Intent Gate · ~3 min

1. **A real answer gets graded.** Here is a big problem with AI tutors. Before any AI sees your message, our code decides what kind of message it is. If a question is open and you type b, that matches an option. So it goes to the grade track.
2. **A request is never graded.** Now you type: make notes on this. A normal AI tutor would mark that as a wrong answer. We don't. It's a request. You get your notes, and the question stays open for later. Uploading a file is also always a request.
3. **Confusion gets help.** You type: I'm confused, can I get a hint? That is a clarification. You get help, and the question is still open. No marks are lost.
4. **Navigation moves first.** And if you say go to topic 3, the pointer moves to topic 3 first, before the tutor speaks. So the lesson always matches where you are. Only a real answer is ever graded. Everything else is handled fairly.

### 15. Points You Can't Farm · ~3 min

1. **Code sets the points.** Grading is done by code first. If you pick an option, code checks it by its index, and the AI only explains the result. Points are also set by code: 20 for correct, 10 for partial, zero otherwise.
2. **No double counting.** What if you resend the same answer, or reload the page? Nothing happens. Each question has a fingerprint, and points are given only once per question. You cannot farm points.
3. **65 means mastered.** Two more correct answers and one partial take you to 70. That crosses 65, so the topic is mastered. The pathway moves to the next topic, and a review is booked for tomorrow. And if the AI claims we moved on when we didn't, the server corrects that text.

### 16. A Question That's Actually Right · ~2 min

1. **Every key is re-solved blind.** A quiz is only fair if its answer key is right. So for maths and science, a second solver works the question out without seeing the key. If both agree, the question gets a green seal and is shown.
2. **Wrong keys get fixed.** If they disagree, the key is corrected. If we still can't confirm it, we regenerate the question once. And if we are still unsure, we ask a short-answer question instead. We never grade you against a key we could not confirm.

### 17. Four Checkpoints of Truth · ~4 min

1. **Tier 0 · Find the risky claims.** Before you see a fact, it is checked. Cheaply for normal text, carefully for risky claims. Tier zero is a free scan. It finds things that are easy to get wrong: numbers with units, dates, laws, formulas. It skips stories like suppose Priya drops a ball.
2. **Tier 1 · Re-derive independently.** Tier one: one cheap AI call works out each risky claim again, on its own. Here, 9.8 and 1857 agree. But the speed of light does not match. That one is flagged.
3. **Tier 2 · Correct or flag.** Tier two digs deeper on the disputed claim and fixes it. 3 times 10 to the 6 becomes 3 times 10 to the 8. If it is still unclear, the lesson adds a note saying worth double-checking, instead of bluffing.
4. **Tier 3 · Links must prove it.** Tier three is for links. Every source must be alive, trusted, and must actually say what we taught. A dead link is dropped. An off-topic page is dropped. And if the checker itself breaks, the lesson still continues. A check can never block learning.

### 18. Draw It or Find It · ~2 min

1. **Concepts get drawn.** ShipLabs has two systems for pictures, and it never mixes them up. If the question is how does it work, like the water cycle, it draws a diagram in code. A flowchart, a chart or a table. Nothing is generated by AI.
2. **Real things get real photos.** If the question is what does it look like, like a handloom, it finds real photos from free, licensed sources, with the photographer's credit. We never generate images with AI for teaching, because they can be wrong or misleading.

### 19. Your Notes Become a Course · ~3 min

1. **Checked at the door.** You can learn from your own notes. Drop a PDF, a photo of the blackboard or a Word file into the chat. First, every file is checked at the door: the type, the real file signature and the size.
2. **Read, even when scanned.** Then it is read page by page. If a page is a scan or handwriting, a vision model reads it. The text is saved inside the chat, with page numbers. And the original file is thrown away. It is never stored.
3. **Ask it, or make it a course.** Now ask: explain page 4. Only page 4 is sent to the AI, inside a glass box marked untrusted. So if the document says ignore your rules, the AI won't follow it. Or tap make this a course, and your notes become the syllabus.

### 20. Beating the Forgetting Curve · ~3 min

1. **The forgetting curve.** This red line is the forgetting curve. You learn something today, and without any review you remember only about 20 percent of it after a week.
2. **Reviews right before you forget.** ShipLabs brings the topic back right before you would forget it. After one day, then six days, then about two weeks, then about five weeks. Each time, memory jumps back up and fades more slowly.
3. **Struggle, and it comes back sooner.** If you struggle in a review, it comes back tomorrow. You see a due today badge, and the review quiz is free, four questions, graded by code. A quiz can reschedule a topic only once, so it cannot be gamed.

### 21. Credits, XP and Ranks · ~3 min

1. **Two currencies, never mixed.** There are two currencies, and they never mix. Credits are what you spend: one credit per message, per lab, per review. If anything fails, the credit comes back automatically. XP is your reputation. You earn it, but you can never spend it.
2. **XP, levels and a rank.** Mastering topics earns XP. Your level follows a simple curve. Level 2 needs 100 XP, level 5 needs 1000. And at level 6, your rank changes from Shishya, the apprentice, to Vidhyarthi, the learner.
3. **From Shishya to Gyani.** There are six ranks, from Shishya to Gyani, the wise one. Plus achievements like Curious Mind and Perfect Score, and daily streaks. Five days in a row unlocks Consistent. Progress you can actually see.

## Part C · Build & Ship

### 22. Coach: One Sentence, Full Project · ~3 min

1. **Free until it is real.** Coach mode starts with a gate too. If you just say hi, you get a friendly reply, free, no AI call. If you say teach me something, it asks one clarifying question, also free. Only when you name a real skill does it build the lab, for one credit.
2. **One sentence becomes a project.** One sentence becomes a full project, like a building with floors. Then an inspector checks it. Is the title real? Is the summary long enough? Are there at least three steps? Are most steps detailed? Here one step is too thin. And any links are peeled off.
3. **Repaired, then approved.** Instead of starting over, it repairs. The previous draft and the list of problems go back to the AI at a lower temperature. The thin step becomes detailed, the lab is approved, and it appears as a step list. After three failed attempts, your credit is refunded.

### 23. The Code Review · ~3 min

1. **A rubric, checked line by line.** Now the code review. Every step has a rubric, usually two to six requirements. The judge checks each one, and every note points at the exact line in your code. Here, three of four pass. Line 10 returns 500 instead of 400. So the verdict is needs work.
2. **Fixed, passed, advanced.** The learner fixes the line. Now all four requirements pass. The step turns green, and the lab moves to the next step. On a pass, the review starts with specific praise for what works.
3. **The lab lifecycle.** The whole lab also has a simple life cycle. It starts as a draft, which you can still edit. Start the lab and a timer runs. Stop it and the timer pauses. When no steps are left, it's completed. You can unskip a step or restart if you want.

### 24. VS Code: Connect Once · ~3 min

1. **A one-time code.** Now ShipLabs inside VS Code. You connect once. On the lab page you click Connect to VS Code. The server prints a short code that lives for five minutes and works only once. The server keeps only a hash of it, not the code itself.
2. **Code in, key out.** VS Code sends the code to the server. The server burns it, so it can never be used again, and revokes any older keys. It returns a new key starting with s-l-x underscore. VS Code keeps it in its secret storage, never in settings or in your repo.
3. **One editor, any lab.** Now the browser and VS Code are connected. The key belongs to you, not to one lab. If you open a different lab and click track this lab, VS Code follows it within 15 seconds. No new code needed.

### 25. Every 5 Seconds · ~2 min

1. **Batched every 5 seconds.** While you work, ShipLabs notes what happens. You edited a file, saved it, created a folder, ran the code. These small events go into a bag, and every five seconds the bag is sent to the server. On the web lab page, they show up live as simple sentences.
2. **Private by design.** And it is private by design. It never sends keystrokes, and never sends file contents in this activity feed. The server checks every event again: unknown fields are dropped, sizes are capped, and paths like dot dot slash are rejected. The lab timer counts real active minutes, not just clock time.

### 26. The Pause That Triggers a Review · ~3 min

1. **Pause, snapshot, compare.** There is no submit button in VS Code. When you stop typing for five seconds, ShipLabs takes a snapshot of your files and makes a fingerprint, a hash. If the fingerprint is the same as last time, nothing is sent. No request, no cost.
2. **Free guards, then one credit.** If it changed, the server checks again for free. Did you touch the code? Did it change? Has it been 45 seconds since the last check? Under 10 checks this hour for this step? Is the lab active? Only then does it spend one credit and call the judge.
3. **Feedback where you work.** Back in VS Code, the status bar flips from checking to needs work. The side panel shows the checklist, two of three, and the next thing to do. And if you keep typing during the cooldown, the review simply waits and runs when the cooldown ends.

### 27. Comments, Never Code · ~3 min

1. **Hints above your lines.** This is the most important rule of ShipLabs. It comments, it never codes. After a review, it writes short hint lines into your file, in the file's own comment style, top to bottom. A header on line one, then notes above each function, loop and condition. Your own lines are never touched.
2. **A careful write.** Writing into someone's file needs care. ShipLabs waits until you are idle. If the file changed since the review, it drops the comments. It removes only its own old lines, adds the new ones, and does not save the file, so one undo removes them all. On the next review, the old hints are replaced.

### 28. Hands Off, I'll Run It · ~3 min

1. **Ready to run.** Sometimes reading code is not enough, you need to run it. When the review says your code is ready to run, ShipLabs asks you once: may I run your code? You can say allow, or never.
2. **Hands off for a moment.** Then, like a lab instructor, it says: hands off for a moment. Editing is paused, a banner shows the exact command, and you can cancel. The code runs with a hard 20 second limit. The output is captured.
3. **Reviewed with the real result.** Editing comes back, and the real output goes straight into a new review. Here everything passes, so the step is done and the next one opens. Because the server never chooses the command, a bad response can never make your computer run something harmful.

### 29. Everything on One Page · ~2 min

1. **The lab, live on the web.** Everything you do in VS Code shows up live on the web lab page. One small request every five seconds brings new events, written as plain sentences. It also brings a fingerprint of the lab. Only when that fingerprint changes does the page reload the full lab. So it feels live, without heavy traffic.
2. **Everything on one page.** And it all becomes a lab report. Total time, reviews passed, runs. Every VS Code session, split whenever there is a gap of two minutes. Stats for each step. And the full history, with repeated edits merged into one line. A teacher, or you, can read exactly how the work was done.

### 30. Three Engines, One Answer · ~2 min

1. **MADHAVA first.** What if the AI is down? Every AI call first goes to our in-house model, MADHAVA. Usually it answers, and we're done.
2. **Timeout? Next engine.** If MADHAVA fails or takes more than 60 seconds, the same request moves to the second model, and that one answers. The learner doesn't even notice.
3. **The last line.** If both fail, the last engine answers. It is always kept at the end of the chain, with its own key. And if everything fails, the learner gets the credit back and a friendly message to try again. Three engines, one answer.

### 31. Locks Everywhere · ~3 min

1. **Five doors for every request.** Security. Picture every request walking down a corridor with five doors. Who are you? Is this chat yours? Is it the right size, with a safe path? Are you within the rate limit? And are the fields clean? A normal request passes all five.
2. **Bad requests bounce.** Now the bad ones. A fake key is stopped at the first door. A file path trying to escape with dot dot slash is stopped at the path check. And a document that says ignore your rules is put in a glass box. The AI can read it, but it can't take orders from it.

### 32. By the Numbers · ~2 min

1. **By the numbers.** Here are the key numbers on one screen. One credit per action. 65 points to master. Three claims and three sources checked per turn. Five seconds of idle before ShipLabs reviews your code. A 45 second cooldown. And a 20 second limit when it runs your code. Every one of these is a real default in the code, and most can be tuned without a redeploy.

### 33. How It Was Built · ~2 min

1. **May to July: the tutor.** How was it built? Step by step, in public. In May, the learning engine. By the end of June, universal levels, the tutor chat, XP and reviews, and streaming. In early July, the state machine, the intent gate and fact checking. And by mid-July, Coach labs.
2. **October to November: ShipLabs.** Then the big one. In late October, the ShipLabs extension for VS Code, with pairing, telemetry and automatic checks. Then lab switching and lab reports. And in November, the rule that it only comments and never edits code, the live lab feed, and auto-run.

### 34. Thank You · ~1 min

1. **Thank you.** That's ShipLabs. A tutor that teaches, checks and coaches, in your browser and in your code editor. The AI writes, the code decides. Thank you. I'm happy to take any questions.
