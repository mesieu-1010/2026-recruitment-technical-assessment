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
    return (
      body &&
      body.type === "ingredient" &&
      typeof body.name === "string" &&
      body.name.trim().length > 0 &&
      typeof body.cookTime === "number" &&
      Number.isInteger(body.cookTime) &&
      body.cookTime >= 0
    );
  }

  // Handle Recipe input
  function ValidateRecipe(body: any): boolean {
    if (
      !body ||
      body.type !== "recipe" ||
      typeof body.name !== "string" ||
      body.name.trim().length === 0 ||
      !Array.isArray(body.requiredItems)
    ) {
      return false;
    }

    const name_seen = new Set <string>();

    for (const item of body.requiredItems) {
      
      if (
        typeof item.name !== "string" ||
        item.name.trim().length === 0 ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 
      ) {
        return false;
      }
      
      // Check for required items with same names
      if (name_seen.has(item.name)) {
        return false;
      }

      name_seen.add(item.name);
    }

    return true;
  }

  app.post("/entry", (req:Request, res:Response) => {
    // TODO: implement me
    const body = req.body;

    if (ValidateIngrdient(body) || ValidateRecipe(body)) {

      // Check for unique entry name
      if (cookbook.has(body.name)) {
        return res.status(400).send();
      }

      cookbook.set(body.name, body);
      return res.status(200).send();
    }

    return res.status(400).send();

  });

  // [TASK 3] ====================================================================
  // Endpoint that returns a summary of a recipe that corresponds to a query name
  app.get("/summary", (req:Request, res:Response) => {
    // TODO: implement me
    res.status(500).send("not yet implemented!")

  });

  // =============================================================================
  // ==== DO NOT TOUCH ===========================================================
  // =============================================================================
  const port = 8080;
  app.listen(port, () => {
    console.log(`Running on: http://127.0.0.1:8080`);
  });
