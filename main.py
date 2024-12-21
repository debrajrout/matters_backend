from fastapi import FastAPI, HTTPException

app = FastAPI()

# In-memory storage for matters
matters = []

# Define valid states and transitions
VALID_STATES = ["Gas", "Liquid", "Solid"]
STATE_TRANSITIONS = {
    "Gas": "Liquid",
    "Liquid": "Solid",
    "Solid": None  # Solid is the final state
}

@app.post("/generate")
def generate_matters(count: int = 1):
    """
    Generate new matters with the default state 'Gas'.
    """
    for _ in range(count):
        matters.append({"id": len(matters) + 1, "state": "Gas"})
    return {
        "message": f"{count} matters generated.",
        "matters": matters
    }

@app.put("/convert/{matter_id}")
def convert_matter(matter_id: int):
    """
    Convert a matter to the next state.
    """
    # Find the matter with the given ID
    matter = next((m for m in matters if m["id"] == matter_id), None)
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    
    current_state = matter["state"]
    next_state = STATE_TRANSITIONS.get(current_state)
    
    if not next_state:
        raise HTTPException(status_code=400, detail="Matter is already in its final state")
    
    # Update the state of the matter
    matter["state"] = next_state
    return {
        "message": f"Matter {matter_id} converted to {next_state}.",
        "matter": matter
    }

@app.get("/matters")
def get_matters():
    """
    Get all matters and their current states.
    """
    return {"matters": matters}

@app.get("/reset")
def reset_matters():
    """
    Reset all matters to the default 'Gas' state.
    """
    global matters
    matters = [{"id": i + 1, "state": "Gas"} for i in range(len(matters))]
    return {
        "message": "All matters reset to the 'Gas' state.",
        "matters": matters
    }
