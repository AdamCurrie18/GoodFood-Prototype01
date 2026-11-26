# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

Adam Currie
**GoodFood:**
**Live site link:**

---

## Work sessions

Copy this block for each session.

Session 1 — November 22nd — driver: Adam

- **establish idea for the website with copilot:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. My startup idea is: **called GoodFood**. Our customers are **anyone wanting to follow a budget, while eating delicious healthy meals**, and the problem we solve is **the difficulty of finding affordable meals and knowing what to cook with the ingredients you have**. Update `data.js` and the text in `index.html` so the site describes our startup. Don't change the layout yet.
  2. now create a friendly looking home page. with the name of the company what we do, for whom, and why it matters.
afterwards you can move to the get started/ explore page which you can leave blank for now,
and the about us page you can make up
- **What worked:** everything i asked worked, 
- **What broke, and how we fixed it:** i didnt like the theme so i changed the design/colours a little
- **Committed?** yes. — commit message: Customize GoodFood branding and landing pages

### Session — [date] — driver: [first name]

- **add key features:**
- **Key prompts we gave Copilot** (paste the important ones):
  1.next up. on the get started page create a table where users enter their budget, # of mouths to feed and preffered grocery store. when they enter those answers the site generates a meal plan with a dinner for each day of the week on one side and a grocery list of everything they need to buy on the other. keep in mind the meals shoukd be pretty cheap.
  2. Ensure prices are realistic 
- **What worked:** it created what i needed with a slot for budget, # of people and store. it then generates a grocery list and possible recipes
- **What broke, and how we fixed it:** the prices were extremely cheap. i got a list of realistic prices and inputed them so the AI bases its prices of that
- **Committed?** yes. — commit message: Add weekly meal planner and store-aware grocery estimates

### Session 3 — November 25th — driver: Adam

- **add recipe instructions:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. i need the recipes to come with a tiny picture of the meal next to them along with a button that redirects the user toa page woth a step by step on how to make the meal along with a youtube link tutorial to how to make said meal
- **What worked:** Each dinner now has a small illustration and a recipe page with ingredients, step-by-step directions, and a YouTube tutorial search link.
- **What broke, and how we fixed it:** Tutorial links open YouTube search results for the selected meal rather than an unverified single video. also it only worked once then stopped doing it. i fixed it over a lengthy conversation
- **Committed?**  Add recipe illustrations and step-by-step cooking instructions

### Session 4 — date not recorded — driver: Adam

- **add a premium subscription:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add a final page offering a $3 subscription with a clever name, gold highlights after purchase, and ingredient reuse, personalized macro and calorie targets, weekly grocery-deal plans, and pantry inventory.
- **What worked:** Golden Ladle simulates activation, saves it on this device, applies the gold theme, and unlocks pantry tracking, sample store-price comparisons, shared-ingredient notes, and approximate recipe nutrition against saved targets.
- **What broke, and how we fixed it:** Real payments and live grocery flyers are not available in this static prototype; the page identifies both limitations.
- **Committed?**Add Golden Ladle premium subscription features

### Session 5 — November 26th — driver: Adam

- **add online grocery links and realistic prices:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add links next to every recommended ingredient that open the item on the selected store's website, and make prices realistic and close to the listed prices.
- **What worked:** Grocery-list and recipe ingredients now link to matching Sobeys/Voilà or Real Canadian Superstore searches. Package estimates were aligned to comparable online listings where accessible.
- **What broke, and how we fixed it:** it couldn't track live prices, no real way to fix, so I just made sure it was clear they were estimates.
- **Committed?** yes, Added retailer links and realistic grocery price estimates

### Session 6 — November 26th — driver: Adam

- **add a simple ingredient-based meal helper and session-only Golden Ladle sign-in:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add a meal helper where users enter ingredients and get matching recipes with detailed step-by-step instructions and a YouTube tutorial link. Reset Golden Ladle to locked each time the site launches, and require sign-in from its page to unlock it.
- **What worked:** The helper ranks the existing recipes by ingredients on hand and shows missing ingredients, detailed instructions, and a YouTube tutorial search link. Golden Ladle unlocks only for the current visit.
- **What broke, and how we fixed it:** the links often didn't work, i tweaked it so it would at least take user to the youtube page with similar meals auto searched.
- **Committed?** yes, Added ingredient-based meal helper and session-only premium access

### Session 7 — November 26th — driver: Adam

- **match meal recommendations to the weekly budget:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. When users set a higher budget, recommend a plan that gets closer to it with more ingredients and more complex meals.
- **What worked:** The planner now selects the highest estimated grocery total that stays within budget, favors more ingredient-rich plans when totals tie, and includes several more substantial dinner options.
- **What broke, and how we fixed it:** it would at time exceed the budget, i switched it so it never would
- **Committed?** yes, Match dinner plans to the weekly budget

### Session 8 — November 26th — driver: Adam

- **add nonintrusive side advertisements:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add fake ads for random products on the left and right of the screen without interrupting the app, like ads on a free website.
- **What worked:** Two fictional sample ads are randomly selected on page load and placed in side rails on wide screens. They are labeled as demo ads and hidden on smaller screens; they do not cover content or interrupt navigation.
- **What broke, and how we fixed it:** the ads didn't come with images, so i had AI make little drawings of the imaginary product.
- **Committed?** yes, Add nonintrusive sample side advertisements

### Session 9 — November 26th — driver: Adam

- **add dietary preferences to meal planning:**
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add dietary options such as vegetarian, vegan, and gluten-free, and adjust recommended meals and ingredients to match.
- **What worked:** The planner now filters meals for vegetarian, vegan, pescatarian, nut-free, and other selections, and substitutes gluten-free, dairy-free, and vegan ingredients where supported.
- **What broke, and how we fixed it:** it initially offered very few options, i had it add some
- **Committed?** yes, Add dietary-aware meal planning

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| | | | |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| | | |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?
