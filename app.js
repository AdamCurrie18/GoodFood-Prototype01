// ============================================================
// app.js — what your site DOES.
// Plain JavaScript, no libraries, no installs.
// It uses STARTUP and LISTINGS from data.js (loaded first).
// ============================================================

(function () {
  "use strict";

  // ----------------------------------------------------------
  // 1. Saving things in the browser (localStorage).
  //    This only remembers things on THIS browser on THIS device.
  //    Your teammates and your customers will NOT see it.
  //    A real product would need a server and a database for that.
  // ----------------------------------------------------------
  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback; // storage blocked or broken: just carry on
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // storage blocked (e.g. private window): ignore
      }
    }
  };

  let savedIds = storage.get("savedIds", []);
  let premiumActive = false;
  let activePlanDinners = null;
  const defaultNutritionTargets = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 70
  };
  let nutritionTargets = storage.get("nutritionTargets", defaultNutritionTargets);
  if (!nutritionTargets || typeof nutritionTargets !== "object" || Array.isArray(nutritionTargets)) {
    nutritionTargets = defaultNutritionTargets;
  }
  let pantryItems = storage.get("pantryItems", []);
  if (!Array.isArray(pantryItems)) pantryItems = [];
  ["calories", "protein", "carbs", "fat"].forEach(function (key) {
    const value = Number(nutritionTargets && nutritionTargets[key]);
    nutritionTargets[key] = Number.isFinite(value) && value > 0 ? value : defaultNutritionTargets[key];
  });

  // ----------------------------------------------------------
  // 2. Put the startup's name and pitch on the page.
  // ----------------------------------------------------------
  document.title = STARTUP.name;
  document.getElementById("brand-name").textContent = STARTUP.name;
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  // ----------------------------------------------------------
  // 3. Views: show one section at a time, based on the #link in the address bar.
  // ----------------------------------------------------------
  function showView() {
    const route = (window.location.hash || "#home").slice(1).split("/");
    const requested = route[0];
    const recipeId = requested === "recipe" ? route[1] || "" : "";
    const recipeSource = requested === "recipe" ? route[2] || "plan" : "plan";
    const views = document.querySelectorAll("[data-view]");
    const exists = Array.prototype.some.call(views, function (view) {
      return view.id === requested;
    });
    const current = exists ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });

    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (current === "recipe") renderRecipeDetail(recipeId, recipeSource);
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showView);

  // ----------------------------------------------------------
  // 4. Explore page: build one card per listing.
  //    We use textContent (not innerHTML) so text is always shown
  //    as text — a basic security habit.
  // ----------------------------------------------------------
  const grid = document.getElementById("listing-grid");
  const searchBox = document.getElementById("search-box");
  const emptyMessage = document.getElementById("empty-message");
  const savedCount = document.getElementById("saved-count");
  const plannerForm = document.getElementById("planner-form");
  const ingredientHelperForm = document.getElementById("ingredient-helper-form");
  const ingredientInput = document.getElementById("ingredient-input");
  const helperStatus = document.getElementById("helper-status");
  const helperResults = document.getElementById("helper-results");
  const planResults = document.getElementById("plan-results");
  const planSummary = document.getElementById("plan-summary");
  const mealPlan = document.getElementById("meal-plan");
  const groceryList = document.getElementById("grocery-list");
  const storeNote = document.getElementById("store-note");
  const sponsoredPromotion = document.getElementById("sponsored-promotion");
  const recipeTitle = document.getElementById("recipe-title");
  const recipeDescription = document.getElementById("recipe-description");
  const recipeBack = document.getElementById("recipe-back");
  const recipeImage = document.getElementById("recipe-image");
  const recipeServings = document.getElementById("recipe-servings");
  const recipeIngredients = document.getElementById("recipe-ingredients");
  const recipeSteps = document.getElementById("recipe-steps");
  const recipeVideoLink = document.getElementById("recipe-video-link");
  const recipeNutrition = document.getElementById("recipe-nutrition");
  const premiumTools = document.getElementById("premium-tools");
  const premiumDashboard = document.getElementById("premium-dashboard");
  const premiumSignInButton = document.getElementById("premium-sign-in");
  const premiumStatus = document.getElementById("premium-status");
  const nutritionTargetForm = document.getElementById("nutrition-target-form");
  const targetStatus = document.getElementById("target-status");
  const leftDemoAd = document.getElementById("left-demo-ad");
  const rightDemoAd = document.getElementById("right-demo-ad");

  const demoAds = [
    { brand: "GreenThumb Home", name: "Countertop herb garden", detail: "Fresh basil and mint, right by your kitchen.", style: "herb", illustration: '<path d="M119 126h82l-10 38h-62z" fill="#c77c46"/><path d="M160 128V53M160 91l-29-24M160 105l27-26" fill="none" stroke="#315b3c" stroke-width="8" stroke-linecap="round"/><ellipse cx="126" cy="63" rx="20" ry="10" transform="rotate(35 126 63)" fill="#78a866"/><ellipse cx="192" cy="74" rx="20" ry="10" transform="rotate(-38 192 74)" fill="#8ebd72"/><ellipse cx="160" cy="49" rx="13" ry="22" fill="#6d9d5a"/>' },
    { brand: "QuickChop", name: "Mini food chopper", detail: "Prep weeknight vegetables in a few quick pulses.", style: "chopper", illustration: '<path d="M102 91h116l-13 59a18 18 0 0 1-18 14h-54a18 18 0 0 1-18-14z" fill="#eaf4f5" stroke="#486c82" stroke-width="7"/><path d="M116 95h88M126 83h68l-7-32h-54z" fill="#557fa3" stroke="#385d7d" stroke-width="6" stroke-linejoin="round"/><rect x="147" y="35" width="26" height="16" rx="7" fill="#dbe6e7"/><path d="M143 119h34M160 107v27" stroke="#97aaab" stroke-width="6" stroke-linecap="round"/><circle cx="191" cy="70" r="5" fill="#f3d16a"/>' },
    { brand: "StoreWell", name: "Glass meal-prep set", detail: "Keep leftovers ready for tomorrow's lunch.", style: "containers", illustration: '<rect x="88" y="65" width="142" height="91" rx="16" fill="#d9eef0" fill-opacity=".72" stroke="#527b84" stroke-width="7"/><path d="M83 64h152v22H83z" rx="8" fill="#648d9a"/><path d="M101 99h116M101 113h83" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="112" y="126" width="34" height="17" rx="8" fill="#e49a58"/><rect x="154" y="126" width="47" height="17" rx="8" fill="#78a86f"/>' },
    { brand: "Everyday Kitchen", name: "Nonstick skillet", detail: "A handy pan for simple meals and easy cleanup.", style: "pan", illustration: '<path d="M205 102l61 29-11 20-67-31" fill="#795c4c" stroke="#4d403b" stroke-width="6" stroke-linejoin="round"/><circle cx="146" cy="104" r="61" fill="#4d5966" stroke="#323d48" stroke-width="8"/><circle cx="146" cy="104" r="43" fill="#77838d"/><path d="M118 110q28-37 56 0-28 25-56 0z" fill="#f0c44c"/><circle cx="125" cy="94" r="7" fill="#82aa68"/><circle cx="163" cy="120" r="8" fill="#de845b"/>' },
    { brand: "Sunny Basket", name: "Seasonal produce box", detail: "A colorful mix for your next home-cooked meal.", style: "produce", illustration: '<path d="M85 95h150l-15 69H100z" fill="#b77b45" stroke="#80552f" stroke-width="7" stroke-linejoin="round"/><path d="M100 112h120M108 132h104" stroke="#e0b37b" stroke-width="7"/><circle cx="123" cy="84" r="23" fill="#df6651"/><circle cx="165" cy="75" r="24" fill="#e6bd4b"/><path d="M185 102q7-42 38-42 2 38-38 42z" fill="#6e9d59"/><path d="M122 59q8-15 18-10" fill="none" stroke="#6e9d59" stroke-width="6" stroke-linecap="round"/>' },
    { brand: "ClearDay", name: "Gentle dish soap", detail: "A little help with the after-dinner dishes.", style: "soap", illustration: '<path d="M133 69V51h53v20" fill="none" stroke="#4c7777" stroke-width="8" stroke-linecap="round"/><path d="M151 52V42h38v10" fill="none" stroke="#4c7777" stroke-width="7" stroke-linecap="round"/><path d="M119 75q0-12 13-12h56q13 0 13 13v73q0 14-14 14h-54q-14 0-14-14z" fill="#a8d7c6" stroke="#4c7777" stroke-width="7"/><rect x="133" y="99" width="54" height="31" rx="8" fill="#f7fcf9"/><path d="M147 115h27" stroke="#70a79a" stroke-width="6" stroke-linecap="round"/><circle cx="223" cy="71" r="11" fill="#e2f4ea"/><circle cx="239" cy="101" r="6" fill="#e2f4ea"/>' }
  ];

  function renderDemoAd(container, ad) {
    const artwork = document.createElement("img");
    artwork.className = "demo-ad-art " + ad.style;
    artwork.alt = "Illustration of " + ad.name;
    artwork.src = "data:image/svg+xml;charset=UTF-8,"
        + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190">'
          + ad.illustration + "</svg>");
    const copy = document.createElement("div");
    copy.className = "demo-ad-copy";
    const label = document.createElement("span");
    label.className = "demo-ad-label";
    label.textContent = "Ad · Demo";
    const brand = document.createElement("p");
    brand.className = "demo-ad-brand";
    brand.textContent = ad.brand + " · fictional";
    const title = document.createElement("h2");
    title.textContent = ad.name;
    const detail = document.createElement("p");
    detail.textContent = ad.detail;
    copy.append(label, brand, title, detail);
    container.replaceChildren(artwork, copy);
  }

  function renderDemoAds() {
    const firstIndex = Math.floor(Math.random() * demoAds.length);
    const remainingAds = demoAds.filter(function (_ad, index) { return index !== firstIndex; });
    const secondIndex = Math.floor(Math.random() * remainingAds.length);
    renderDemoAd(leftDemoAd, demoAds[firstIndex]);
    renderDemoAd(rightDemoAd, remainingAds[secondIndex]);
  }

  // Reference prices are package estimates, not live store inventory or quotes.
  const packageCatalog = {
    "Pasta|g": { size: 900, label: "900 g package", prices: { sobeys: 3.49, superstore: 2 } },
    "Canned tomatoes|can": { size: 1, label: "796 ml can", prices: { sobeys: 2.29, superstore: 2 } },
    "Onion|each": { size: 1, label: "onion", prices: { sobeys: 0.99, superstore: 0.75 } },
    "Garlic|clove": { size: 10, label: "bulb (about 10 cloves)", prices: { sobeys: 1.99, superstore: 1.54 } },
    "Rice|g": { size: 2000, label: "2 kg bag", prices: { sobeys: 6.99, superstore: 5 } },
    "Kidney beans|can": { size: 1, label: "540 ml can", prices: { sobeys: 1.99, superstore: 1.69 } },
    "Canned corn|can": { size: 1, label: "341 ml can", prices: { sobeys: 1.79, superstore: 1.5 } },
    "Salsa|ml": { size: 650, label: "650 ml jar", prices: { sobeys: 5.49, superstore: 3.5 } },
    "Potatoes|kg": { size: 2.27, label: "2.27 kg bag", prices: { sobeys: 6.99, superstore: 5 } },
    "Cheddar|g": { size: 400, label: "400 g block", prices: { sobeys: 7.49, superstore: 5.88 } },
    "Sour cream|ml": { size: 500, label: "500 ml tub", prices: { sobeys: 3.49, superstore: 2.79 } },
    "Canned beans|can": { size: 1, label: "540 ml can", prices: { sobeys: 1.99, superstore: 1.69 } },
    "Lentils|g": { size: 900, label: "900 g bag", prices: { sobeys: 4.99, superstore: 4 } },
    "Curry powder|g": { size: 400, label: "400 g bag", prices: { sobeys: 4.99, superstore: 3.5 } },
    "Eggs|each": { size: 12, label: "12-egg carton", prices: { sobeys: 5.49, superstore: 3.93 } },
    "Frozen mixed vegetables|g": { size: 750, label: "750 g bag", prices: { sobeys: 4.49, superstore: 3.79 } },
    "Soy sauce|ml": { size: 450, label: "450 ml bottle", prices: { sobeys: 3.49, superstore: 2.29 } },
    "Tortillas|each": { size: 10, label: "10-count package", prices: { sobeys: 4.49, superstore: 3.75 } },
    "Chickpeas|can": { size: 1, label: "540 ml can", prices: { sobeys: 1.99, superstore: 1.69 } },
    "Cabbage|g": { size: 1700, label: "medium head (about 1.7 kg)", prices: { sobeys: 4.99, superstore: 3.75 } },
    "Yogurt|ml": { size: 750, label: "750 ml tub", prices: { sobeys: 4.49, superstore: 3.47 } },
    "Tuna|can": { size: 2, label: "2-can multipack", prices: { sobeys: 3.49, superstore: 2.78 } },
    "Frozen peas|g": { size: 750, label: "750 g bag", prices: { sobeys: 4.49, superstore: 3.79 } },
    "Mayonnaise|ml": { size: 890, label: "890 ml jar", prices: { sobeys: 6.49, superstore: 5.79 } },
    "Black beans|can": { size: 1, label: "540 ml can", prices: { sobeys: 1.99, superstore: 1.69 } },
    "Ramen|package": { size: 1, label: "package", prices: { sobeys: 0.99, superstore: 0.59 } },
    "Peanut butter|g": { size: 1000, label: "1 kg jar", prices: { sobeys: 5.49, superstore: 4.5 } },
    "Bread|slice": { size: 20, label: "loaf (about 20 slices)", prices: { sobeys: 4.49, superstore: 3.99 } },
    "Chicken breast|g": { size: 1000, label: "1 kg package", prices: { sobeys: 17.99, superstore: 15.99 } },
    "Ground beef|g": { size: 450, label: "450 g package", prices: { sobeys: 8.99, superstore: 7.99 } },
    "Broccoli|g": { size: 500, label: "500 g bunch", prices: { sobeys: 5.49, superstore: 4.49 } },
    "Bell pepper|each": { size: 3, label: "3-pepper package", prices: { sobeys: 5.99, superstore: 4.99 } },
    "Mushrooms|g": { size: 227, label: "227 g package", prices: { sobeys: 3.49, superstore: 2.99 } },
    "Cream|ml": { size: 473, label: "473 ml carton", prices: { sobeys: 3.49, superstore: 2.99 } },
    "Parmesan|g": { size: 200, label: "200 g package", prices: { sobeys: 7.49, superstore: 6.49 } },
    "Spinach|g": { size: 227, label: "227 g package", prices: { sobeys: 4.49, superstore: 3.99 } },
    "Lemon|each": { size: 2, label: "2-count package", prices: { sobeys: 3.99, superstore: 3.49 } },
    "Gluten-free pasta|g": { size: 454, label: "454 g package", prices: { sobeys: 5.49, superstore: 4.99 } },
    "Corn tortillas|each": { size: 12, label: "12-count package", prices: { sobeys: 5.49, superstore: 4.99 } },
    "Tamari|ml": { size: 296, label: "296 ml bottle", prices: { sobeys: 5.99, superstore: 4.99 } },
    "Rice noodles|package": { size: 1, label: "package", prices: { sobeys: 3.49, superstore: 2.99 } },
    "Gluten-free bread|slice": { size: 16, label: "16-slice loaf", prices: { sobeys: 7.49, superstore: 6.99 } },
    "Vegan ramen|package": { size: 1, label: "package", prices: { sobeys: 1.49, superstore: 1.19 } },
    "Vegan cheddar|g": { size: 200, label: "200 g package", prices: { sobeys: 7.49, superstore: 6.99 } },
    "Plant-based sour cream|ml": { size: 340, label: "340 ml tub", prices: { sobeys: 5.49, superstore: 4.99 } },
    "Plant-based yogurt|ml": { size: 750, label: "750 ml tub", prices: { sobeys: 6.49, superstore: 5.99 } },
    "Oat cream|ml": { size: 473, label: "473 ml carton", prices: { sobeys: 4.49, superstore: 3.99 } },
    "Dairy-free parmesan|g": { size: 200, label: "200 g package", prices: { sobeys: 7.49, superstore: 6.99 } }
  };

  const sponsoredOffers = [
    { key: "Chicken breast|g", product: "Chicken breast", discount: 20 },
    { key: "Parmesan|g", product: "Parmesan", discount: 15 },
    { key: "Broccoli|g", product: "Broccoli", discount: 20 },
    { key: "Mushrooms|g", product: "Mushrooms", discount: 15 },
    { key: "Cream|ml", product: "Cream", discount: 20 },
    { key: "Bell pepper|each", product: "Bell peppers", discount: 15 }
  ];

  const dinners = [
    {
      id: "tomato-pasta",
      name: "Tomato pasta",
      description: "A simple tomato sauce with onion and garlic, tossed with pasta.",
      imageColors: ["#d85e46", "#e7bb55", "#6f9b5b"],
      steps: [
        "Fill a large pot with water and bring it to a rolling boil. Use the pasta package directions to estimate how much water you need.",
        "Add the pasta and cook for the package's suggested time, tasting near the end so it stays tender but not mushy.",
        "Before draining, carefully scoop out about 60 ml (1/4 cup) of pasta water. Drain the pasta in a colander.",
        "While the pasta cooks, finely chop the onion and mince the garlic. Put both in a saucepan with a small splash of water.",
        "Cook the onion over medium heat for 3–4 minutes, stirring, until softened. Add the canned tomatoes and stir.",
        "Bring the sauce to a gentle bubble, lower the heat, and simmer uncovered for 12–15 minutes. Stir now and then until it thickens and the onion is tender.",
        "Add the drained pasta to the sauce and toss until coated. Stir in a little reserved pasta water if needed, then serve."
      ],
      ingredients: [
        { name: "Pasta", amount: 100, unit: "g" },
        { name: "Canned tomatoes", amount: 0.2, unit: "can" },
        { name: "Onion", amount: 0.1, unit: "each" },
        { name: "Garlic", amount: 0.5, unit: "clove" }
      ]
    },
    {
      id: "rice-bean-bowls",
      name: "Rice and bean bowls",
      description: "Rice topped with warm kidney beans, corn, and salsa.",
      imageColors: ["#d8b15d", "#8c583d", "#79a25e"],
      steps: [
        "Measure the rice and rinse it in a sieve under cold water until the water runs mostly clear.",
        "Cook the rice with the water amount on its package. Keep it covered while it simmers, then let it stand off the heat for 5 minutes.",
        "Open and drain the kidney beans and corn. Rinse them under cool water if you want a milder, less salty taste.",
        "Put the beans and corn in a saucepan with 2 tablespoons of water. Warm over medium heat for 5–7 minutes, stirring gently.",
        "Fluff the rice with a fork and divide it between bowls. Spoon the hot bean-and-corn mixture over the rice.",
        "Top each bowl with salsa and serve while warm."
      ],
      ingredients: [
        { name: "Rice", amount: 75, unit: "g" },
        { name: "Kidney beans", amount: 0.5, unit: "can" },
        { name: "Canned corn", amount: 0.1, unit: "can" },
        { name: "Salsa", amount: 30, unit: "ml" }
      ]
    },
    {
      id: "loaded-baked-potatoes",
      name: "Loaded baked potatoes",
      description: "Tender baked potatoes topped with beans, cheddar, and sour cream.",
      imageColors: ["#d0a050", "#e7c86d", "#78a35c"],
      steps: [
        "Heat the oven to 200°C (400°F). Scrub the potatoes under running water and dry them.",
        "Prick each potato 6–8 times with a fork so steam can escape. Set them on a baking tray.",
        "Bake for 45–60 minutes, turning once halfway through. They are ready when a knife slides easily into the centre.",
        "Near the end of baking, drain and rinse the canned beans. Warm them in a small saucepan with 1–2 tablespoons of water for about 5 minutes.",
        "Grate the cheddar while the beans warm. Carefully split each hot potato lengthwise and fluff the centre with a fork.",
        "Spoon the warm beans over the potatoes, add cheddar so it softens, and finish with sour cream."
      ],
      ingredients: [
        { name: "Potatoes", amount: 0.3, unit: "kg" },
        { name: "Cheddar", amount: 25, unit: "g" },
        { name: "Sour cream", amount: 20, unit: "ml" },
        { name: "Canned beans", amount: 0.25, unit: "can" }
      ]
    },
    {
      id: "lentil-curry-rice",
      name: "Lentil curry with rice",
      description: "A gently spiced tomato and lentil curry served with rice.",
      imageColors: ["#c87642", "#e0b84d", "#709956"],
      steps: [
        "Rinse the rice and cook it according to its package directions. Keep it covered while you make the curry.",
        "Rinse the dry lentils in a sieve and pick out any debris. Finely chop the onion.",
        "Put the lentils, onion, curry powder, and canned tomatoes in a saucepan. Add about 250 ml water for each 75 g of lentils.",
        "Bring the saucepan to a boil, then reduce the heat to low. Partially cover and simmer for 20–25 minutes, stirring every few minutes.",
        "Check that the lentils are soft all the way through. If the pan becomes dry before they are tender, add water a few tablespoons at a time.",
        "When tender, simmer uncovered for another 2–3 minutes if the curry looks too thin. Turn off the heat.",
        "Fluff the rice and serve the lentil curry over it."
      ],
      ingredients: [
        { name: "Lentils", amount: 75, unit: "g" },
        { name: "Rice", amount: 60, unit: "g" },
        { name: "Canned tomatoes", amount: 0.15, unit: "can" },
        { name: "Onion", amount: 0.1, unit: "each" },
        { name: "Curry powder", amount: 2, unit: "g" }
      ]
    },
    {
      id: "egg-vegetable-fried-rice",
      name: "Egg and vegetable fried rice",
      description: "Rice, egg, and frozen vegetables tossed with a little soy sauce.",
      imageColors: ["#e8c952", "#75a05b", "#c78149"],
      steps: [
        "Rinse the rice and cook it according to its package directions. Spread it in a shallow dish for a few minutes so excess steam can escape.",
        "Put the frozen vegetables in a large non-stick pan with 2 tablespoons of water. Cover and cook over medium heat for 4–6 minutes, stirring once.",
        "When the vegetables are hot and tender, uncover the pan and let extra water evaporate. Stir in the soy sauce.",
        "Add the cooked rice and break up any clumps with a spoon. Stir-fry for 3–4 minutes until steaming hot.",
        "Push the rice and vegetables to one side. Crack the egg into the clear side of the pan and scramble until fully cooked with no runny egg remaining.",
        "Mix the cooked egg through the rice, check that the whole dish is hot, and serve."
      ],
      ingredients: [
        { name: "Rice", amount: 75, unit: "g" },
        { name: "Eggs", amount: 1, unit: "each" },
        { name: "Frozen mixed vegetables", amount: 75, unit: "g" },
        { name: "Soy sauce", amount: 15, unit: "ml" }
      ]
    },
    {
      id: "chickpea-cabbage-wraps",
      name: "Chickpea cabbage wraps",
      description: "Crunchy cabbage and chickpeas wrapped with a quick yogurt dressing.",
      imageColors: ["#d0a45b", "#719854", "#eee1b9"],
      steps: [
        "Open and drain the chickpeas, then rinse them under cool water. Pat them dry with a clean towel.",
        "Put the chickpeas in a bowl and mash about half with a fork. Leave the rest whole for texture.",
        "Remove any tough outer cabbage leaves. Thinly slice the amount needed and set it aside.",
        "In a small bowl, stir the yogurt with 1–2 teaspoons of water until it is loose enough to drizzle.",
        "Warm the tortillas in a dry pan over low heat for about 20 seconds per side, or follow the package directions.",
        "Fill each tortilla with chickpeas and cabbage, drizzle with the yogurt dressing, fold, and serve. Keep the filling modest so the wraps close easily."
      ],
      ingredients: [
        { name: "Tortillas", amount: 1, unit: "each" },
        { name: "Chickpeas", amount: 0.5, unit: "can" },
        { name: "Cabbage", amount: 50, unit: "g" },
        { name: "Yogurt", amount: 30, unit: "ml" }
      ]
    },
    {
      id: "tuna-pea-pasta",
      name: "Tuna and pea pasta",
      description: "A quick pasta dinner with tuna, peas, and a creamy mayonnaise dressing.",
      imageColors: ["#dfc987", "#79a567", "#d88b5a"],
      steps: [
        "Bring a large pot of water to a boil. Add the pasta and cook for the time printed on the package.",
        "Add the frozen peas for the final 2 minutes of pasta cooking so they heat through without becoming mushy.",
        "Before draining, save about 60 ml (1/4 cup) of pasta water. Drain the pasta and peas together.",
        "Drain the tuna well and flake it into small pieces with a fork.",
        "Return the pasta and peas to the warm pot off the heat. Fold in the tuna and mayonnaise.",
        "Add reserved pasta water 1 tablespoon at a time until the sauce coats the pasta. Serve warm."
      ],
      ingredients: [
        { name: "Pasta", amount: 90, unit: "g" },
        { name: "Tuna", amount: 0.4, unit: "can" },
        { name: "Frozen peas", amount: 50, unit: "g" },
        { name: "Mayonnaise", amount: 10, unit: "ml" }
      ]
    },
    {
      id: "black-bean-quesadillas",
      name: "Black bean quesadillas",
      description: "Crisp tortillas filled with mashed black beans, cheddar, and salsa.",
      imageColors: ["#d2a148", "#8b503b", "#739957"],
      steps: [
        "Drain and rinse the black beans. Put them in a bowl and mash with a fork until mostly broken up but still a little chunky.",
        "Grate the cheddar. Lay a tortilla flat and spread mashed beans over one half, leaving a small border at the edge.",
        "Add cheddar and a small spoonful of salsa over the beans. Fold the empty half over the filling and press gently.",
        "Heat a dry non-stick pan over medium heat. Cook one folded tortilla for 2–3 minutes until the underside is crisp and golden.",
        "Flip carefully with a spatula and cook another 2–3 minutes, until the second side is golden and the cheese has melted.",
        "Move to a cutting board and rest for 1 minute before slicing into wedges. Repeat with the remaining tortillas and serve."
      ],
      ingredients: [
        { name: "Tortillas", amount: 1, unit: "each" },
        { name: "Black beans", amount: 0.35, unit: "can" },
        { name: "Cheddar", amount: 30, unit: "g" },
        { name: "Salsa", amount: 30, unit: "ml" }
      ]
    },
    {
      id: "peanut-veggie-noodles",
      name: "Peanut veggie noodles",
      description: "Ramen noodles and vegetables tossed in a quick peanut-soy sauce.",
      imageColors: ["#d2ae66", "#75a15c", "#b87652"],
      steps: [
        "Bring a pot of water to a boil and cook the ramen for the time on its package. If the package includes seasoning, set it aside.",
        "Add the frozen vegetables for the final 3–4 minutes of cooking, or follow the vegetable package directions until hot and tender.",
        "In a heat-safe bowl, stir together the peanut butter and soy sauce. Add hot water 1 tablespoon at a time until the sauce is smooth and pourable.",
        "Before draining, reserve about 120 ml (1/2 cup) of noodle water. Drain the noodles and vegetables carefully.",
        "Return them to the pot and pour over the peanut sauce. Toss until evenly coated.",
        "Loosen the sauce with reserved noodle water a little at a time if needed. Taste, then serve hot."
      ],
      ingredients: [
        { name: "Ramen", amount: 1, unit: "package" },
        { name: "Peanut butter", amount: 20, unit: "g" },
        { name: "Soy sauce", amount: 15, unit: "ml" },
        { name: "Frozen mixed vegetables", amount: 60, unit: "g" }
      ]
    },
    {
      id: "tomato-egg-skillet",
      name: "Tomato and egg skillet with toast",
      description: "Eggs gently cooked in a tomato and onion sauce, with toast on the side.",
      imageColors: ["#d85b43", "#e2bd4f", "#729956"],
      steps: [
        "Finely chop the onion. Put it in a non-stick skillet with 2 tablespoons of water and cook over medium heat for 4–5 minutes, stirring until soft.",
        "Pour in the canned tomatoes and stir. Bring the sauce to a gentle simmer, then cook uncovered for 8–10 minutes.",
        "Taste the sauce and make a shallow well for each egg. Crack one egg into each well, taking care not to break the yolks.",
        "Cover the skillet and cook on low for 6–8 minutes. Check that the whites are fully set; continue cooking in 1-minute intervals if needed.",
        "While the eggs cook, toast the bread until golden. Keep an eye on the skillet so the sauce does not boil vigorously.",
        "Remove the skillet from the heat and serve the eggs and tomato sauce with the toast."
      ],
      ingredients: [
        { name: "Eggs", amount: 2, unit: "each" },
        { name: "Canned tomatoes", amount: 0.2, unit: "can" },
        { name: "Onion", amount: 0.1, unit: "each" },
        { name: "Bread", amount: 1, unit: "slice" }
      ]
    },
    {
      id: "lemon-chicken-broccoli-rice",
      name: "Lemon chicken and broccoli rice bowls",
      description: "Chicken, broccoli, and peppers over rice with a lemon-soy pan sauce.",
      imageColors: ["#d9b84e", "#6f9b5b", "#d27d4b"],
      steps: [
        "Rinse the rice and cook it according to the package directions.",
        "Cut the chicken into small pieces and season lightly. Cook it in a large pan over medium heat until the thickest pieces reach 74 C (165 F).",
        "Cut the broccoli and bell pepper into bite-sized pieces. Add them to the pan with a splash of water, cover, and cook for 5-7 minutes until tender.",
        "Stir in the minced garlic and soy sauce. Cook for 1 minute, then squeeze in lemon juice and stir.",
        "Serve the chicken and vegetables over the cooked rice, spooning the pan sauce over each bowl."
      ],
      ingredients: [
        { name: "Chicken breast", amount: 150, unit: "g" },
        { name: "Rice", amount: 75, unit: "g" },
        { name: "Broccoli", amount: 100, unit: "g" },
        { name: "Bell pepper", amount: 0.5, unit: "each" },
        { name: "Soy sauce", amount: 15, unit: "ml" },
        { name: "Garlic", amount: 0.5, unit: "clove" },
        { name: "Lemon", amount: 0.25, unit: "each" }
      ]
    },
    {
      id: "creamy-chicken-mushroom-pasta",
      name: "Creamy chicken and mushroom pasta",
      description: "Chicken, mushrooms, and spinach folded into a creamy parmesan pasta.",
      imageColors: ["#e0c989", "#729956", "#a76c47"],
      steps: [
        "Bring a pot of water to a boil and cook the pasta according to its package directions. Reserve a small mug of pasta water before draining.",
        "Slice the chicken into small pieces and cook in a large pan over medium heat until the thickest pieces reach 74 C (165 F). Transfer the chicken to a plate.",
        "Add the sliced mushrooms and minced garlic to the pan. Cook for 4-5 minutes until softened, adding a splash of water if the pan gets dry.",
        "Pour in the cream and stir in the parmesan. Simmer gently for 2 minutes; do not let the sauce boil hard.",
        "Add the spinach and stir until wilted, then return the chicken and drained pasta to the pan.",
        "Toss everything together, loosening the sauce with a little reserved pasta water if needed. Serve hot."
      ],
      ingredients: [
        { name: "Pasta", amount: 90, unit: "g" },
        { name: "Chicken breast", amount: 125, unit: "g" },
        { name: "Mushrooms", amount: 75, unit: "g" },
        { name: "Spinach", amount: 30, unit: "g" },
        { name: "Cream", amount: 60, unit: "ml" },
        { name: "Parmesan", amount: 15, unit: "g" },
        { name: "Garlic", amount: 0.5, unit: "clove" }
      ]
    },
    {
      id: "beef-broccoli-pepper-skillet",
      name: "Beef, broccoli, and pepper skillet",
      description: "A hearty beef and vegetable stir-fry served over rice.",
      imageColors: ["#b66d49", "#78a35c", "#e0bc52"],
      steps: [
        "Rinse the rice and cook it according to the package directions.",
        "Cut the broccoli, bell pepper, and mushrooms into bite-sized pieces. Slice the onion thinly.",
        "Cook the ground beef in a large pan over medium heat, breaking it apart, until no pink remains and it is thoroughly cooked.",
        "Add the vegetables and a splash of water. Cover and cook for 5-7 minutes, stirring once, until the broccoli is tender.",
        "Stir in the soy sauce and cook uncovered for 1 minute. Serve the beef and vegetables over the rice."
      ],
      ingredients: [
        { name: "Ground beef", amount: 125, unit: "g" },
        { name: "Rice", amount: 60, unit: "g" },
        { name: "Broccoli", amount: 75, unit: "g" },
        { name: "Bell pepper", amount: 0.5, unit: "each" },
        { name: "Mushrooms", amount: 40, unit: "g" },
        { name: "Onion", amount: 0.1, unit: "each" },
        { name: "Soy sauce", amount: 15, unit: "ml" }
      ]
    }
  ];

  function getDietaryDinners(restrictions) {
    const selected = new Set(restrictions);
    const meatAndFishIds = [
      "tuna-pea-pasta",
      "lemon-chicken-broccoli-rice",
      "creamy-chicken-mushroom-pasta",
      "beef-broccoli-pepper-skillet"
    ];
    const meatIds = [
      "lemon-chicken-broccoli-rice",
      "creamy-chicken-mushroom-pasta",
      "beef-broccoli-pepper-skillet"
    ];
    const veganIds = [
      "tomato-pasta",
      "rice-bean-bowls",
      "loaded-baked-potatoes",
      "lentil-curry-rice",
      "egg-vegetable-fried-rice",
      "chickpea-cabbage-wraps",
      "peanut-veggie-noodles"
    ];

    return dinners.filter(function (dinner) {
      if (selected.has("vegetarian") && meatAndFishIds.indexOf(dinner.id) !== -1) return false;
      if (selected.has("pescatarian") && meatIds.indexOf(dinner.id) !== -1) return false;
      if (selected.has("vegan") && veganIds.indexOf(dinner.id) === -1) return false;
      if (selected.has("nut-free") && dinner.id === "peanut-veggie-noodles") return false;
      return true;
    }).map(function (dinner) {
      const substitutions = {};
      if (selected.has("dairy-free") || selected.has("vegan")) {
        substitutions.Cheddar = "Vegan cheddar";
        substitutions["Sour cream"] = "Plant-based sour cream";
        substitutions.Yogurt = "Plant-based yogurt";
      }
      if (selected.has("dairy-free")) {
        substitutions.Cream = "Oat cream";
        substitutions.Parmesan = "Dairy-free parmesan";
      }
      if (selected.has("vegan") && !selected.has("gluten-free")) {
        substitutions.Ramen = "Vegan ramen";
      }
      if (selected.has("gluten-free")) {
        substitutions.Pasta = "Gluten-free pasta";
        substitutions.Tortillas = "Corn tortillas";
        substitutions["Soy sauce"] = "Tamari";
        substitutions.Ramen = "Rice noodles";
        substitutions.Bread = "Gluten-free bread";
      }

      const ingredients = dinner.ingredients
          .filter(function (ingredient) {
            return !(selected.has("vegan") && ingredient.name === "Eggs");
          })
          .map(function (ingredient) {
            return {
              name: substitutions[ingredient.name] || ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit
            };
          });
      let steps = dinner.steps.slice();
      let name = dinner.name;
      let description = dinner.description;
      if (selected.has("vegan") && dinner.id === "egg-vegetable-fried-rice") {
        name = "Vegetable fried rice";
        description = "Rice and frozen vegetables tossed with a little soy sauce.";
        steps = steps.filter(function (step) {
          return step.indexOf("Push the rice and vegetables to one side.") !== 0
              && step.indexOf("Crack the egg into the clear side") !== 0;
        }).map(function (step) {
          return step.indexOf("Mix the cooked egg through the rice") === 0
              ? "Stir the rice and vegetables together, check that the dish is steaming hot, and serve."
              : step;
        });
      }
      if (selected.has("gluten-free")) {
        steps = steps.map(function (step) {
          return step.replace(/soy sauce/gi, "tamari")
              .replace(/ramen/gi, "rice noodles")
              .replace(/\bbread\b/gi, "gluten-free bread");
        });
      } else if (selected.has("vegan")) {
        steps = steps.map(function (step) {
          return step.replace(/ramen/gi, "vegan ramen");
        });
      }
      if (selected.has("dairy-free") || selected.has("vegan")) {
        description = description.replace(/cheddar/gi, "vegan cheddar")
            .replace(/sour cream/gi, "plant-based sour cream")
            .replace(/yogurt/gi, "plant-based yogurt");
        steps = steps.map(function (step) {
          return step.replace(/cheddar/gi, "vegan cheddar")
              .replace(/sour cream/gi, "plant-based sour cream")
              .replace(/yogurt/gi, "plant-based yogurt");
        });
      }
      if (selected.has("dairy-free")) {
        description = description.replace(/\bcream\b/gi, "oat cream")
            .replace(/parmesan/gi, "dairy-free parmesan");
        steps = steps.map(function (step) {
          return step.replace(/\bcream\b/gi, "oat cream")
              .replace(/parmesan/gi, "dairy-free parmesan");
        });
      }
      return Object.assign({}, dinner, {
        name: name,
        description: description,
        ingredients: ingredients,
        steps: steps
      });
    });
  }

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
  const nutritionPerServing = {
    "tomato-pasta": { calories: 390, protein: 13, carbs: 72, fat: 6 },
    "rice-bean-bowls": { calories: 410, protein: 15, carbs: 78, fat: 5 },
    "loaded-baked-potatoes": { calories: 430, protein: 17, carbs: 68, fat: 12 },
    "lentil-curry-rice": { calories: 440, protein: 20, carbs: 78, fat: 5 },
    "egg-vegetable-fried-rice": { calories: 390, protein: 16, carbs: 62, fat: 9 },
    "chickpea-cabbage-wraps": { calories: 420, protein: 16, carbs: 65, fat: 11 },
    "tuna-pea-pasta": { calories: 470, protein: 28, carbs: 61, fat: 12 },
    "black-bean-quesadillas": { calories: 460, protein: 21, carbs: 55, fat: 17 },
    "peanut-veggie-noodles": { calories: 480, protein: 18, carbs: 69, fat: 16 },
    "tomato-egg-skillet": { calories: 360, protein: 19, carbs: 43, fat: 12 },
    "lemon-chicken-broccoli-rice": { calories: 520, protein: 42, carbs: 62, fat: 10 },
    "creamy-chicken-mushroom-pasta": { calories: 650, protein: 42, carbs: 69, fat: 22 },
    "beef-broccoli-pepper-skillet": { calories: 580, protein: 32, carbs: 62, fat: 20 }
  };

  function getStoreKey(store) {
    const name = store.toLowerCase();
    if (name.indexOf("sobeys") !== -1) return "sobeys";
    if (name.indexOf("superstore") !== -1) return "superstore";
    return null;
  }

  function makeStoreLink(itemName, storeKey) {
    const retailers = {
      sobeys: { name: "Sobeys (Voilà)", searchUrl: "https://voila.ca/search?q=" },
      superstore: {
        name: "Real Canadian Superstore",
        searchUrl: "https://www.realcanadiansuperstore.ca/en/search?search-bar="
      }
    };
    const retailer = retailers[storeKey];
    if (!retailer) throw new Error("Missing retailer link for " + storeKey);
    const link = document.createElement("a");
    link.className = "grocery-link";
    link.href = retailer.searchUrl + encodeURIComponent(itemName);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Shop at " + retailer.name;
    return link;
  }

  function chooseSponsoredOffer(store, chance, offerIndex) {
    if (chance >= 0.4) return null;
    const storeKey = getStoreKey(store);
    if (!storeKey) throw new Error("Missing retailer for sponsored promotion");
    const offer = sponsoredOffers[offerIndex % sponsoredOffers.length];
    const packageInfo = packageCatalog[offer.key];
    if (!packageInfo) throw new Error("Missing package estimate for " + offer.key);
    const regularPrice = packagePrice(packageInfo, storeKey);
    return {
      product: offer.product,
      storeKey: storeKey,
      regularPrice: regularPrice,
      salePrice: Number((regularPrice * (1 - offer.discount / 100)).toFixed(2)),
      discount: offer.discount
    };
  }

  function renderSponsoredPromotion(store) {
    sponsoredPromotion.replaceChildren();
    const offer = chooseSponsoredOffer(store, Math.random(), Math.floor(Math.random() * sponsoredOffers.length));
    sponsoredPromotion.hidden = !offer;
    if (!offer) return;

    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent = "Sponsored sample promotion · " + store + " partner concept";
    const heading = document.createElement("h2");
    heading.textContent = offer.discount + "% off " + offer.product;
    const description = document.createElement("p");
    description.className = "sponsored-price";
    description.textContent = currency.format(offer.salePrice) + " (sample sale price; regular estimate "
        + currency.format(offer.regularPrice) + ")";
    const disclaimer = document.createElement("p");
    disclaimer.className = "muted";
    disclaimer.textContent = "Fictional promotion for this prototype; " + store
        + " has not sponsored or verified this offer. Confirm real prices with the store.";
    const productLink = makeStoreLink(offer.product, offer.storeKey);
    productLink.textContent = "Search " + store + " for " + offer.product;
    sponsoredPromotion.append(label, heading, description, disclaimer, productLink);
  }

  function packagePrice(packageInfo, storeKey) {
    return storeKey
        ? packageInfo.prices[storeKey]
        : (packageInfo.prices.sobeys + packageInfo.prices.superstore) / 2;
  }

  function buildShoppingCart(selectedDinners, householdSize, storeKey, pantryItems) {
    const groceries = new Map();
    const pantry = new Set(pantryItems.map(function (item) { return item.toLowerCase(); }));
    selectedDinners.forEach(function (dinner) {
        dinner.ingredients.forEach(function (ingredient) {
          if (pantry.has(ingredient.name.toLowerCase())) return;
          const key = ingredient.name + "|" + ingredient.unit;
          const existing = groceries.get(key);
          if (existing) {
            existing.amount += ingredient.amount * householdSize;
          } else {
            groceries.set(key, {
              name: ingredient.name,
              amount: ingredient.amount * householdSize,
              unit: ingredient.unit
            });
          }
      });
    });

    const items = Array.from(groceries.entries())
        .map(function (entry) {
          const key = entry[0];
          const ingredient = entry[1];
          const packageInfo = packageCatalog[key];
          if (!packageInfo) throw new Error("Missing package estimate for " + key);

          const packageCount = Math.ceil(ingredient.amount / packageInfo.size);
          return {
            name: ingredient.name,
            purchaseDescription: packageCount + " × " + packageInfo.label,
            cost: packageCount * packagePrice(packageInfo, storeKey)
          };
        })
        .sort(function (first, second) { return first.name.localeCompare(second.name); });

    const total = items.reduce(function (sum, item) { return sum + item.cost; }, 0);
    return { items: items, total: Number(total.toFixed(2)) };
  }

  function findBestPlan(householdSize, store, pantryItems, budget, availableDinners) {
    const storeKey = getStoreKey(store);
    const candidates = (availableDinners || dinners).slice();
    let bestPlan = null;
    if (candidates.length === 0) return null;
    while (candidates.length < weekdays.length) {
      candidates.push(candidates[candidates.length % (availableDinners || dinners).length]);
    }

    function chooseDinners(startIndex, selectedDinners) {
        if (selectedDinners.length === weekdays.length) {
          const cart = buildShoppingCart(selectedDinners, householdSize, storeKey, pantryItems);
          const complexity = selectedDinners.reduce(function (total, dinner) {
            return total + dinner.ingredients.length;
          }, 0);
          const candidate = { dinners: selectedDinners.slice(), cart: cart, complexity: complexity };
          if (!bestPlan) {
            bestPlan = candidate;
          } else if (Number.isFinite(budget)) {
            const candidateFits = cart.total <= budget;
            const bestFits = bestPlan.cart.total <= budget;
            if ((candidateFits && !bestFits)
                || (candidateFits === bestFits
                  && (candidateFits
                    ? cart.total > bestPlan.cart.total
                    : cart.total < bestPlan.cart.total))
                || (candidateFits === bestFits
                  && cart.total === bestPlan.cart.total
                  && complexity > bestPlan.complexity)) {
              bestPlan = candidate;
            }
          } else if (cart.total < bestPlan.cart.total
              || (cart.total === bestPlan.cart.total && complexity > bestPlan.complexity)) {
            bestPlan = candidate;
          }
          return;
        }

        const remaining = weekdays.length - selectedDinners.length;
        for (let index = startIndex; index <= candidates.length - remaining; index += 1) {
          selectedDinners.push(candidates[index]);
          chooseDinners(index + 1, selectedDinners);
          selectedDinners.pop();
      }
    }

    chooseDinners(0, []);
    return bestPlan;
  }

  function renderMealPlan(budget, householdSize, store, availableDinners, restrictions) {
    const ownedItems = premiumActive ? pantryItems : [];
    const plan = findBestPlan(householdSize, store, ownedItems, budget, availableDinners);
    const storeKey = getStoreKey(store);
    activePlanDinners = availableDinners;

    mealPlan.replaceChildren();
    groceryList.replaceChildren();

    plan.dinners.forEach(function (dinner, index) {
      const row = document.createElement("tr");
      const dayCell = document.createElement("th");
      dayCell.scope = "row";
      dayCell.textContent = weekdays[index];
      const dinnerCell = document.createElement("td");
        const meal = document.createElement("div");
        meal.className = "meal-name-cell";
        const image = document.createElement("img");
        image.className = "meal-thumbnail";
        image.src = makeMealImage(dinner);
        image.alt = "Illustration of " + dinner.name;
        const name = document.createElement("span");
        name.textContent = dinner.name;
        meal.append(image, name);
        dinnerCell.append(meal);

        const recipeCell = document.createElement("td");
        const recipeLink = document.createElement("a");
        recipeLink.className = "button secondary recipe-link";
        recipeLink.href = "#recipe/" + dinner.id + "/plan";
        recipeLink.textContent = "View recipe";
        recipeLink.setAttribute("aria-label", "View recipe: " + dinner.name);
        recipeCell.append(recipeLink);

        row.append(dayCell, dinnerCell, recipeCell);
      mealPlan.append(row);
    });

    plan.cart.items.forEach(function (grocery) {
        const item = document.createElement("li");
        const name = document.createElement("span");
        name.className = "grocery-item-name";
        const ingredientName = document.createElement("span");
        ingredientName.textContent = grocery.name;
        name.append(ingredientName, makeStoreLink(grocery.name, storeKey));
        const purchase = document.createElement("span");
        purchase.className = "grocery-purchase";
        purchase.textContent = grocery.purchaseDescription;
        const cost = document.createElement("span");
        cost.className = "grocery-cost";
        cost.textContent = currency.format(grocery.cost);
        item.append(name, purchase, cost);
        groceryList.append(item);
    });
    if (plan.cart.items.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Your pantry covers every item for this plan.";
      groceryList.append(item);
    }

    const summary = document.createElement("p");
    summary.textContent = "Estimated grocery checkout for " + householdSize + " "
        + (householdSize === 1 ? "person" : "people") + " at " + store + ": "
        + currency.format(plan.cart.total) + " against your " + currency.format(budget) + " weekly budget.";
    const assessment = document.createElement("p");
    assessment.className = plan.cart.total > budget ? "budget-warning" : "muted";
    assessment.textContent = plan.cart.total > budget
        ? "This is the lowest-checkout-cost plan from our dinner options, but it exceeds your budget."
        : "This is the closest estimated plan we can build without going over your budget.";
    const caveat = document.createElement("p");
    caveat.className = "muted";
    caveat.textContent = "Uses full packages, so leftovers may remain. Prices are rough package estimates based on comparable products, not live quotes. Local prices, stock, and promotions can change; confirm the current price on the linked store page.";
    const summaryItems = [summary, assessment];
    if (restrictions.length) {
      const dietaryNote = document.createElement("p");
      dietaryNote.className = "muted";
      dietaryNote.textContent = "Preferences applied: " + restrictions.join(", ")
          + ". Check product labels and cross-contact warnings; this prototype cannot guarantee allergy safety.";
      summaryItems.push(dietaryNote);
    }
    if (availableDinners.length < weekdays.length) {
      const varietyNote = document.createElement("p");
      varietyNote.className = "muted";
      varietyNote.textContent = "Some dinners repeat because the sample menu has only "
          + availableDinners.length + " recipes matching your selections.";
      summaryItems.push(varietyNote);
    }
    if (premiumActive) {
      const sobeys = findBestPlan(householdSize, "Sobeys", ownedItems, undefined, availableDinners);
      const superstore = findBestPlan(householdSize, "Superstore", ownedItems, undefined, availableDinners);
      const dealScout = document.createElement("p");
      dealScout.className = "muted";
      dealScout.textContent = "Deal scout estimate (sample prices, not live flyers): Sobeys "
          + currency.format(sobeys.cart.total) + " · Superstore "
          + currency.format(superstore.cart.total) + ".";
      const counts = new Map();
      plan.dinners.forEach(function (dinner) {
        dinner.ingredients.forEach(function (ingredient) {
          counts.set(ingredient.name, (counts.get(ingredient.name) || 0) + 1);
        });
      });
      const reused = Array.from(counts.entries())
          .filter(function (entry) { return entry[1] > 1; })
          .map(function (entry) { return entry[0]; });
      const reuseNote = document.createElement("p");
      reuseNote.className = "muted";
      reuseNote.textContent = reused.length
          ? "Waste-Not Week: shared ingredients include " + reused.join(", ") + "."
          : "Waste-Not Week: this plan has no repeated ingredients in its dinner recipes.";
      summaryItems.push(dealScout, reuseNote);
    }
    summaryItems.push(caveat);
    planSummary.replaceChildren.apply(planSummary, summaryItems);
    storeNote.textContent = premiumActive && ownedItems.length
        ? "Pantry items deducted: " + ownedItems.join(", ") + ". Remaining quantities use full packages."
        : "Package quantities are for the full shopping trip; unused amounts may remain for another week.";
    renderSponsoredPromotion(store);
    planResults.hidden = false;
  }

  function makeMealImage(dinner) {
    const colors = dinner.imageColors;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">'
        + '<rect width="120" height="90" rx="14" fill="#edf3f8"/>'
        + '<ellipse cx="60" cy="48" rx="39" ry="29" fill="#fff" stroke="#d7e0e8" stroke-width="3"/>'
        + '<ellipse cx="50" cy="47" rx="17" ry="13" fill="' + colors[0] + '"/>'
        + '<circle cx="72" cy="39" r="9" fill="' + colors[1] + '"/>'
        + '<circle cx="70" cy="58" r="7" fill="' + colors[2] + '"/>'
        + '<circle cx="42" cy="59" r="4" fill="' + colors[2] + '"/>'
        + '<circle cx="57" cy="34" r="4" fill="' + colors[1] + '"/>'
        + '</svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function renderRecipeDetail(recipeId, recipeSource) {
    const recipeOptions = recipeSource === "plan" && activePlanDinners
        ? activePlanDinners
        : dinners;
    const dinner = recipeOptions.find(function (item) { return item.id === recipeId; });
    recipeIngredients.replaceChildren();
    recipeSteps.replaceChildren();
    recipeBack.href = recipeSource === "helper" ? "#meal-helper" : "#explore";
    recipeBack.textContent = recipeSource === "helper"
        ? "Back to ingredient matches"
        : "Back to your meal plan";

    if (!dinner) {
        recipeTitle.textContent = "Recipe not found";
        recipeDescription.textContent = "Return to your meal plan and choose a recipe to view its instructions.";
        recipeImage.hidden = true;
        recipeServings.hidden = true;
        recipeVideoLink.hidden = true;
        return;
    }

    const householdSize = Number(document.getElementById("household-size").value) || 1;
    recipeTitle.textContent = dinner.name;
    recipeDescription.textContent = dinner.description;
    recipeImage.src = makeMealImage(dinner);
    recipeImage.alt = "Illustration of " + dinner.name;
    recipeImage.hidden = false;
    recipeServings.textContent = "Ingredients scaled for " + householdSize
        + (householdSize === 1 ? " person." : " people.");
    recipeServings.hidden = false;
    const nutrition = nutritionPerServing[dinner.id];
    recipeNutrition.hidden = !premiumActive;
    if (premiumActive && nutrition) {
      recipeNutrition.textContent = "Estimated per serving: " + nutrition.calories + " kcal, "
          + nutrition.protein + " g protein, " + nutrition.carbs + " g carbohydrates, and "
          + nutrition.fat + " g fat. That's about "
          + Math.round(nutrition.calories / nutritionTargets.calories * 100) + "% of your "
          + nutritionTargets.calories + " kcal calorie target, "
          + Math.round(nutrition.protein / nutritionTargets.protein * 100) + "% of your "
          + nutritionTargets.protein + " g protein target, "
          + Math.round(nutrition.carbs / nutritionTargets.carbs * 100) + "% of your "
          + nutritionTargets.carbs + " g carbohydrate target, and "
          + Math.round(nutrition.fat / nutritionTargets.fat * 100) + "% of your "
          + nutritionTargets.fat + " g fat target. "
          + "Nutrition is approximate and may vary by ingredients and portions.";
    }

    const storeKey = getStoreKey(document.getElementById("grocery-store").value);
    dinner.ingredients.forEach(function (ingredient) {
        const item = document.createElement("li");
        const amount = Number((ingredient.amount * householdSize).toFixed(2)).toLocaleString("en-CA");
        const packageInfo = packageCatalog[ingredient.name + "|" + ingredient.unit];
        const packageCost = packagePrice(packageInfo, storeKey);
        const shopLink = makeStoreLink(ingredient.name, storeKey);
        shopLink.textContent += " · " + currency.format(packageCost) + " / " + packageInfo.label;
        item.append(
          document.createTextNode(amount + " " + ingredient.unit + " " + ingredient.name + " — "),
          shopLink
        );
        recipeIngredients.append(item);
    });

    dinner.steps.forEach(function (step) {
        const item = document.createElement("li");
        item.textContent = step;
        recipeSteps.append(item);
    });

    recipeVideoLink.href = "https://www.youtube.com/results?search_query="
        + encodeURIComponent(dinner.name + " recipe tutorial");
    recipeVideoLink.textContent = "Find a YouTube tutorial for " + dinner.name;
    recipeVideoLink.hidden = false;
  }

  function normalizeIngredient(value) {
    return value.toLowerCase()
        .replace(/&/g, " and ")
        .replace(/\bveggies\b|\bveg\b/g, "vegetables")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map(function (word) {
          if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
          if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
          return word;
        })
        .join(" ");
  }

  function ingredientMatches(query, recipeIngredient) {
    const queryWords = normalizeIngredient(query).split(" ").filter(Boolean);
    const recipeWords = normalizeIngredient(recipeIngredient).split(" ");
    return queryWords.length > 0 && queryWords.every(function (word) {
      return recipeWords.indexOf(word) !== -1;
    });
  }

  function renderIngredientMatches(availableIngredients) {
    const matches = dinners.map(function (dinner) {
      const available = dinner.ingredients.filter(function (ingredient) {
        return availableIngredients.some(function (query) {
          return ingredientMatches(query, ingredient.name);
        });
      });
      return {
        dinner: dinner,
        available: available,
        missing: dinner.ingredients.filter(function (ingredient) {
          return available.indexOf(ingredient) === -1;
        }),
        score: available.length / dinner.ingredients.length
      };
    }).filter(function (match) {
      return match.available.length > 0;
    }).sort(function (first, second) {
      return second.score - first.score || second.available.length - first.available.length;
    });

    helperResults.replaceChildren();
    if (matches.length === 0) {
      helperStatus.textContent = "No recipes matched those ingredients. Try common names like rice, eggs, pasta, beans, or tomatoes.";
      return;
    }

    helperStatus.textContent = matches.length + " recipe"
        + (matches.length === 1 ? "" : "s")
        + " matched at least one ingredient. Best matches are shown first; check each recipe for anything still needed.";
    matches.forEach(function (match) {
      const card = document.createElement("article");
      card.className = "card helper-recipe-card";
      const title = document.createElement("h2");
      title.textContent = match.dinner.name;
      const description = document.createElement("p");
      description.textContent = match.dinner.description;
      const count = document.createElement("p");
      count.className = "helper-match-count";
      count.textContent = match.available.length + " of " + match.dinner.ingredients.length
          + " ingredients on hand";
      const available = document.createElement("p");
      available.className = "muted";
      available.textContent = "You have: " + match.available.map(function (item) {
        return item.name;
      }).join(", ");
      card.append(title, description, count, available);

      const missing = document.createElement("p");
      missing.className = "muted";
      missing.textContent = match.missing.length
          ? "Still needed: " + match.missing.map(function (item) { return item.name; }).join(", ")
          : "You have everything listed for this recipe.";
      const recipeLink = document.createElement("a");
      recipeLink.className = "button secondary recipe-link";
      recipeLink.href = "#recipe/" + match.dinner.id + "/helper";
      recipeLink.textContent = "See detailed steps";
      card.append(missing, recipeLink);
      helperResults.append(card);
    });
  }

  function makeCard(item) {
    const card = document.createElement("article");
    card.className = "card";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.category;

    const title = document.createElement("h2");
    title.textContent = item.name;

    const text = document.createElement("p");
    text.textContent = item.description;

    const isSaved = savedIds.indexOf(item.id) !== -1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button secondary";
    button.textContent = isSaved ? "Saved ✓" : "Save";
    button.setAttribute("aria-pressed", isSaved ? "true" : "false");
    button.addEventListener("click", function () {
      toggleSaved(item.id);
    });

    card.append(tag, title, text, button);
    return card;
  }

  function toggleSaved(id) {
    if (savedIds.indexOf(id) === -1) {
      savedIds.push(id);
    } else {
      savedIds = savedIds.filter(function (savedId) { return savedId !== id; });
    }
    storage.set("savedIds", savedIds);
    renderListings();
  }

  function applyPremiumState() {
    document.body.classList.toggle("golden-ladle", premiumActive);
    leftDemoAd.parentElement.hidden = premiumActive;
    rightDemoAd.parentElement.hidden = premiumActive;
    premiumTools.hidden = !premiumActive;
    premiumDashboard.hidden = !premiumActive;
    premiumSignInButton.hidden = premiumActive;
    premiumStatus.textContent = premiumActive
        ? "Golden Ladle is unlocked for this visit. Refreshing the site will lock it again."
        : "Sign in to unlock Golden Ladle for this visit.";
    document.getElementById("pantry-items").value = pantryItems.join(", ");
    document.getElementById("target-calories").value = nutritionTargets.calories;
    document.getElementById("target-protein").value = nutritionTargets.protein;
    document.getElementById("target-carbs").value = nutritionTargets.carbs;
    document.getElementById("target-fat").value = nutritionTargets.fat;
  }

  function renderListings() {
    const query = searchBox.value.trim().toLowerCase();
    const matches = LISTINGS.filter(function (item) {
      const text = (item.name + " " + item.category + " " + item.description).toLowerCase();
      return text.indexOf(query) !== -1;
    });

    grid.replaceChildren.apply(grid, matches.map(makeCard));
    emptyMessage.hidden = matches.length > 0;
    savedCount.textContent = savedIds.length === 0
      ? "Tap Save on anything you like."
      : "You've saved " + savedIds.length + " item(s) on this device.";
  }

  searchBox.addEventListener("input", renderListings);
  ingredientHelperForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const availableIngredients = ingredientInput.value.split(",")
        .map(function (item) { return item.trim(); })
        .filter(Boolean);
    ingredientInput.setCustomValidity(availableIngredients.length
        ? ""
        : "Enter at least one ingredient name, separated by commas.");
    if (!ingredientHelperForm.reportValidity()) return;
    renderIngredientMatches(availableIngredients);
  });
  premiumSignInButton.addEventListener("click", function () {
    premiumActive = true;
    applyPremiumState();
  });
  nutritionTargetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!nutritionTargetForm.reportValidity()) return;

    nutritionTargets = {
      calories: Number(document.getElementById("target-calories").value),
      protein: Number(document.getElementById("target-protein").value),
      carbs: Number(document.getElementById("target-carbs").value),
      fat: Number(document.getElementById("target-fat").value)
    };
    storage.set("nutritionTargets", nutritionTargets);
    targetStatus.textContent = "Your daily goals are saved on this device.";
  });
  plannerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const storeInput = document.getElementById("grocery-store");
    const store = storeInput.value.trim();
    storeInput.setCustomValidity(store ? "" : "Enter a grocery store name.");
    if (!plannerForm.reportValidity()) return;

    if (premiumActive) {
      pantryItems = document.getElementById("pantry-items").value
          .split(",")
          .map(function (item) { return item.trim(); })
          .filter(function (item, index, items) {
            return item && items.findIndex(function (other) {
              return other.toLowerCase() === item.toLowerCase();
            }) === index;
          });
      storage.set("pantryItems", pantryItems);
    }

    const restrictions = Array.prototype.map.call(
      plannerForm.querySelectorAll('input[name="dietaryRestrictions"]:checked'),
      function (input) { return input.value; }
    );
    const availableDinners = getDietaryDinners(restrictions);
    renderMealPlan(
      Number(document.getElementById("weekly-budget").value),
      Number(document.getElementById("household-size").value),
      store,
      availableDinners,
      restrictions
    );
  });

  // ----------------------------------------------------------
  // 5. Start up.
  // ----------------------------------------------------------
  applyPremiumState();
  renderDemoAds();
  renderListings();
  showView();
})();
