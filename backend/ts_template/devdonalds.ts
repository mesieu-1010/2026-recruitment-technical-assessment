  import express, { Request, Response } from "express";

  // ==== Type Definitions, feel free to add or modify ==========================
  interface cookbookEntry {
    name: string;
    type: string;
  }

  interface requiredItem {
    name: string;
    quantity: number;
  }

  interface recipe extends cookbookEntry {
    requiredItems: requiredItem[];
  }

  interface ingredient extends cookbookEntry {
    cookTime: number;
  }

  // =============================================================================
  // ==== HTTP Endpoint Stubs ====================================================
  // =============================================================================
  const app = express();
  app.use(express.json());

  // Task 1 helper (don't touch)
  app.post("/parse", (req:Request, res:Response) => {
    const { input } = req.body;

    const parsed_string = parse_handwriting(input)
    if (parsed_string == null) {
      res.status(400).send("this string is cooked");
      return;
    } 
    res.json({ msg: parsed_string });
    return;
    
  });

  // [TASK 1] ====================================================================
  // Takes in a recipeName and returns it in a form that 
  const parse_handwriting = (recipeName: string): string | null => {
    if (!recipeName) {
      return null;
    }
    
    // Create a new string to handle the complete string
    let result = "";
    // Check for having whitespace (use for capitalizing or adding extra whitespace)
    let SpaceBefore = true;

    for (let i = 0; i < recipeName.length; i++ ) {
      const character = recipeName[i];
      
      if (character === "-" || character === "_") {
        if (!SpaceBefore) {
          result += " ";
          SpaceBefore = true;
        }
        continue;
      }

      else if  ((character >= "a" && character <= "z") ||
          (character >= "A" && character <= "Z")) {
        if (SpaceBefore) {
          result += character.toUpperCase();
        } else {
          result += character.toLowerCase();
        }
        
        SpaceBefore = false;
        continue;
      }

      else if (character === " ") {
        if (!SpaceBefore) {
          result += character;
          SpaceBefore = true;
        }

        continue;
      }

    }

    result = result.trim();
    return result.length > 0 ? result : null;
  }

  // [TASK 2] ====================================================================
  // Endpoint that adds a CookbookEntry to your magical cookbook

  // Checking two types of entry. 
  type Entry = recipe | ingredient;

  const cookbook = new Map <string, Entry>();

  // Handle ingredient input
  function ValidateIngrdient(body: any): boolean {
    const parsedName = body?.name && typeof body.name === "string"
    ? parse_handwriting(body.name)
    : null;

  return (
    body &&
    body.type === "ingredient" &&
    typeof body.name === "string" &&
    parsedName !== null &&
    typeof body.cookTime === "number" &&
    Number.isInteger(body.cookTime) &&
    body.cookTime >= 0
  );
  }

  // Handle Recipe input
  function ValidateRecipe(body: any): boolean {
    const parsedRecipeName =
    body?.name && typeof body.name === "string" ? parse_handwriting(body.name) : null;

    if (
      !body ||
      body.type !== "recipe" ||
      typeof body.name !== "string" ||
      parsedRecipeName === null ||
      !Array.isArray(body.requiredItems)
    ) {
      return false;
    }

    const name_seen = new Set<string>();

    for (const item of body.requiredItems) {
      if (typeof item?.name !== "string") {
        return false;
      }

      const parsedItemName = parse_handwriting(item.name);

      if (
        !parsedItemName ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return false;
      }

      if (name_seen.has(parsedItemName)) {
        return false;
      }

      name_seen.add(parsedItemName);
    }

    return true;
  }

  app.post("/entry", (req:Request, res:Response) => {
    // TODO: implement me
    const body = req.body;

    if (!ValidateIngrdient(body) && !ValidateRecipe(body)) {
      return res.status(400).send();
    }

    const parsed_name = parse_handwriting(body.name);

    if (!parsed_name) {
      return res.status(400).send();
    }

    body.name = parsed_name;
    
    if (body.type === "recipe") {
      for (const item of body.requiredItems) {
        const parsedItem = parse_handwriting(item.name);

        if (!parsedItem) {
          return res.status(400).send()
        };

        item.name = parsedItem;
      }
    }
    
    if (cookbook.has(parsed_name)) {
      return res.status(400).send();
    }

    cookbook.set(parsed_name, body);
    return res.status(200).send();

  });

  // [TASK 3] ====================================================================
  // Endpoint that returns a summary of a recipe that corresponds to a query name
  app.get("/summary", (req:Request, res:Response) => {
    // [TASK 3] ====================================================================
  try {

    const rawName = typeof req.query.name === "string" ? req.query.name.trim() : "";
    const recipeName = parse_handwriting(rawName);

    if (!recipeName) {
      return res.status(400).send();
    }

    const recipeEntry = cookbook.get(recipeName);

    if (!recipeEntry || recipeEntry.type !== "recipe") {
      return res.status(400).send();
    }

    // Accumulates base ingredient quantities
    const ingredientTotals = new Map<string, number>();

    const accumulateIngredient = (name: string, quantity: number) => {
      let currentTotal = ingredientTotals.get(name);

      if (currentTotal === undefined) {
        currentTotal = 0;
      }

      const newTotal = currentTotal + quantity;
      ingredientTotals.set(name, newTotal);
    };

    // Uses recursion - backtracking to check for the cases
    const resolveRecipe = (entryName: string, quantityMultiplier: number): number => {
      const entry = cookbook.get(entryName);
      if (!entry) throw new Error("Missing dependency");

      // Base ingredient
      if (entry.type === "ingredient") {
        const ingredientEntry = entry as ingredient;
        accumulateIngredient(ingredientEntry.name, quantityMultiplier);
        return ingredientEntry.cookTime * quantityMultiplier;
      }

      // Nested recipe
      const recipe = entry as recipe;
      let totalCookTime = 0;

      for (const item of recipe.requiredItems) {
        totalCookTime += resolveRecipe(
          item.name,
          quantityMultiplier * item.quantity
        );
      }

      return totalCookTime;
    };

    const totalCookTime = resolveRecipe(recipeName, 1);

    const ingredients: requiredItem[] = Array.from(
      ingredientTotals.entries()
    ).map(([name, quantity]) => ({ name, quantity }));

    return res.status(200).json({
      name: recipeName,
      cookTime: totalCookTime,
      ingredients,
    });

  } catch {
    return res.status(400).send();

  }});


  

  // =============================================================================
  // ==== DO NOT TOUCH ===========================================================
  // =============================================================================
  const port = 8080;
  app.listen(port, () => {
    console.log(`Running on: http://127.0.0.1:8080`);
  });
