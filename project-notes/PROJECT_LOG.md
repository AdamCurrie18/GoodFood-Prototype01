# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Name:** Adam
**Startup:** GoodFood
**Live site link:** http://127.0.0.1:8000/ 

## Work sessions

### Session 1 — November 22, 2026 — driver: Adam

- **Goal for this session:** Establish the GoodFood idea and create the initial home and About pages.
- **Key prompts we gave Copilot** (paste the important ones):
  1. My startup idea is: **called GoodFood**. Our customers are **anyone wanting to follow a budget, while eating delicious healthy meals**, and the problem we solve is **the difficulty of finding affordable meals and knowing what to cook with the ingredients you have**. Update `data.js` and the text in `index.html` so the site describes our startup. Don't change the layout yet.
  2. now create a friendly looking home page. with the name of the company what we do, for whom, and why it matters.
afterwards you can move to the get started/ explore page which you can leave blank for now,
and the about us page you can make up
- **What worked:** The requested startup details and initial pages were added.
- **What broke, and how we fixed it:** I did not like the initial theme, so I changed the design and colours.
- **Committed?** yes. — commit message: Customize GoodFood branding and landing pages

### Session 2 — November 23, 2026 — driver: Adam

- **Goal for this session:** Add the weekly meal planner and grocery list.
- **Key prompts we gave Copilot** (paste the important ones):
  1.next up. on the get started page create a table where users enter their budget, # of mouths to feed and preffered grocery store. when they enter those answers the site generates a meal plan with a dinner for each day of the week on one side and a grocery list of everything they need to buy on the other. keep in mind the meals shoukd be pretty cheap.
  2. Ensure prices are realistic 
- **What worked:** The planner takes a budget, household size, and store, then generates dinner suggestions and a grocery list.
- **What broke, and how we fixed it:** The initial prices were unrealistically low. I provided more realistic prices for the estimates.
- **Committed?** yes. — commit message: Add weekly meal planner and store-aware grocery estimates

### Session 3 — November 25, 2026 — driver: Adam

- **Goal for this session:** Add recipe instructions and tutorial links.
- **Key prompts we gave Copilot** (paste the important ones):
  1. i need the recipes to come with a tiny picture of the meal next to them along with a button that redirects the user toa page woth a step by step on how to make the meal along with a youtube link tutorial to how to make said meal
- **What worked:** Each dinner now has a small illustration and a recipe page with ingredients, step-by-step directions, and a YouTube tutorial search link.
- **What broke, and how we fixed it:** The tutorial links initially stopped working after the first attempt. I worked through the issue with Copilot; the links now open YouTube search results rather than an unverified video.
- **Committed?** yes — commit message: Add recipe illustrations and step-by-step cooking instructions
### Session 3 — November 25, 2026 — driver: Adam
### Session 3 — November 25, 2026 — driver: Adam
### Session 3 — November 25, 2026 — driver: Adam

### Session 4 — date not recorded — driver: Adam

- **Goal for this session:** Add the Golden Ladle premium feature page.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add a final page offering a $3 subscription with a clever name, gold highlights after purchase, and ingredient reuse, personalized macro and calorie targets, weekly grocery-deal plans, and pantry inventory.
- **What worked:** Golden Ladle simulates activation, saves it on this device, applies the gold theme, and unlocks pantry tracking, sample store-price comparisons, shared-ingredient notes, and approximate recipe nutrition against saved targets.
- **What broke, and how we fixed it:** Real payments and live grocery flyers are not available in this static prototype; the page identifies both limitations.
- **Committed?** yes — commit message: Add Golden Ladle premium subscription features

### Session 5 — November 26, 2026 — driver: Adam

- **Goal for this session:** Add retailer search links and improve grocery price estimates.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add links next to every recommended ingredient that open the item on the selected store's website, and make prices realistic and close to the listed prices.
- **What worked:** Grocery-list and recipe ingredients now link to matching Sobeys/Voilà or Real Canadian Superstore searches. Package estimates were aligned to comparable online listings where accessible.
- **What broke, and how we fixed it:** The prototype cannot track live prices. I kept prices labelled as estimates.
- **Committed?** yes, Added retailer links and realistic grocery price estimates

### Session 6 — November 26, 2026 — driver: Adam

- **Goal for this session:** Add an ingredient-based meal helper and session-only Golden Ladle access.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add a meal helper where users enter ingredients and get matching recipes with detailed step-by-step instructions and a YouTube tutorial link. Reset Golden Ladle to locked each time the site launches, and require sign-in from its page to unlock it.
- **What worked:** The helper ranks the existing recipes by ingredients on hand and shows missing ingredients, detailed instructions, and a YouTube tutorial search link. Golden Ladle unlocks only for the current visit.
- **What broke, and how we fixed it:** Direct tutorial links were unreliable, so I changed them to open YouTube search results for similar meals.
- **Committed?** yes, Added ingredient-based meal helper and session-only premium access

### Session 7 — November 26, 2026 — driver: Adam

- **Goal for this session:** Keep meal recommendations within the weekly budget.
- **Key prompts we gave Copilot** (paste the important ones):
  1. When users set a higher budget, recommend a plan that gets closer to it with more ingredients and more complex meals.
- **What worked:** The planner now selects the highest estimated grocery total that stays within budget, favors more ingredient-rich plans when totals tie, and includes several more substantial dinner options.
- **What broke, and how we fixed it:** Some plans could exceed the budget. I changed the planner to select a plan that stays within the entered budget.
- **Committed?** yes, Match dinner plans to the weekly budget

### Session 8 — November 26, 2026 — driver: Adam

- **Goal for this session:** Add non-intrusive sample advertisements.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add fake ads for random products on the left and right of the screen without interrupting the app, like ads on a free website.
- **What worked:** Two fictional sample ads are randomly selected on page load and placed in side rails on wide screens. They are labeled as demo ads and hidden on smaller screens; they do not cover content or interrupt navigation.
- **What broke, and how we fixed it:** The ads had no images, so I asked Copilot to make small illustrations of the fictional products.
- **Committed?** yes, Add nonintrusive sample side advertisements

### Session 9 — November 26, 2026 — driver: Adam

- **Goal for this session:** Add dietary preferences to meal planning.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add dietary options such as vegetarian, vegan, and gluten-free, and adjust recommended meals and ingredients to match.
- **What worked:** The planner now filters meals for vegetarian, vegan, pescatarian, nut-free, and other selections, and substitutes gluten-free, dairy-free, and vegan ingredients where supported.
- **What broke, and how we fixed it:** The first version offered very few options, so I asked Copilot to add more.
- **Committed?** yes, Add dietary-aware meal planning

## Things that broke (running list)

| date | What broke  | what i tried | What finally fixed it |

|Nov 23|the estimated prices were very cheap and unrealistic|I tried asking it to be more realistic, that didn't work|I had ChatGPT generate a list of essential groceries and their approximate prices at sobeys and superstore respectively, I then gave that list to copilot and had it base it's prices off that.|

|Nov 25|meal plans were remaining cheap even if budget was raised|tried asking it to cater the meal plan to the amount of money provided |that worked |

| Nov 25 | the ads I wanted looked cheap and had no images  | asked it to add little illustrations | That fixed it |

| Nov 25 | once the "golden ladle" was unlocked, it remained so everytime the user joined.  | i made it so users have to sign in to the golden ladle | that worked.

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |

| Real accounts and sign-in | To verify users, securely save profiles, prevent subscription abuse, and let members access data across devices | Medium; several thousand dollars for authentication, account recovery, and privacy-compliance work |
| Persistent user database | To store household budgets, meal histories, pantry items, favourites, nutrition targets, and subscriptions reliably | Medium to hard; roughly $5,000-$20,000 to build and operate a secure initial system |
| Real payments and recurring billing | To charge the $3 subscription, issue refunds, handle failed payments, and manage cancellations | Medium; setup is manageable, but ongoing fees and taxes would add 3-5% of revenue plus subscriptions |
| Live retailer inventory and grocery prices | To give accurate prices and availability instead of estimates and avoid directing users to incorrect or missing items | Hard and expensive; requires retailer agreements or reliable APIs, plus regular syncing and maintenance |
| Security and privacy controls | To protect passwords, payment details, personal goals, pantry data, and account information against unauthorized access | Medium to hard; a proper security audit and encrypted infrastructure could cost $10,000-$30,000 or more |
| Real dietary and allergy safeguards | To provide reliable substitutions and clear allergen warnings for users with medical dietary needs | Hard; requires nutrition expertise, careful data review, warnings, and liability/legal guidance |
| Production customer support and moderation | To handle incorrect results, retailer complaints, account problems, unsafe advice, and reports from customers | Medium; may require a small support team and policies before the app receives significant traffic |
| Mobile app and notifications | To make planning convenient on the go and send weekly reminders, shopping updates, and grocery-deal alerts | Hard; a polished app could cost $20,000-$100,000+, depending on platforms and features |
| Staff, partnerships, and operations | To manage the business, maintain data, negotiate retailer relationships, and support future marketing and growth | Hard and expensive; a small team could require $100,000+ per year before significant revenue |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
How quickly it can create basically anything I imagined is very impressive. It did not need especially detailed prompts to infer what I meant, and it used it's own intuition to create things the app could use.
2. Which parts were easy, and which were hard? Why do you think that is?
The creation of the app was easy, because if something didn't work it was simple to go and fix it with Copilot. The part that was harder was simply understanding how github coding functions and the orginization of everything. However after creating this project I feel way more confident in my understanding of the software.
3. If a competitor had the same AI tool, how long would it take them to copy your site?
I do not think it would take them very long at all. i think with the creation of this sort of vibe coding the power of a website or app will be in the creativity of the idea. succesful sites / apps will need to rely on creative ideas, great networking and some luck to be the first in and reap the benifits.