import os
import datetime
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from google import genai
from google.genai import types
from supabase import create_client, Client

app = FastAPI()
security = HTTPBasic()

# Enable CORS since frontend runs on a different port during local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_supabase() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_ANON_KEY")
    if not supabase_url or not supabase_key:
        print("Missing Supabase credentials, analytics will be bypassed.")
        return None
    return create_client(supabase_url, supabase_key)

class GenerateRequest(BaseModel):
    input: str
    style: str
    cringe_level: int
    post_length: str

@app.post("/api/generate")
async def generate_post(request: GenerateRequest):
    # Log to Supabase silently
    try:
        supabase = get_supabase()
        if supabase:
            supabase.table("logs").insert({
                "query": request.input,
                "style": request.style,
                "cringe_level": request.cringe_level,
                "post_length": request.post_length,
                "timestamp": datetime.datetime.utcnow().isoformat()
            }).execute()
    except Exception as e:
        print(f"Error logging to Supabase: {e}")

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY environment variable not set")
    
    try:
        # Initialize GenAI client
        client = genai.Client(api_key=api_key)
        
        system_instruction = f"""You are an AI trained to parody the most obnoxious, self-aggrandizing, and buzzword-heavy posts on LinkedIn. Your singular goal is to take a mundane, everyday statement and completely over-engineer it into a profound professional milestone or business lesson.

PARAMETERS:
- Core Event: {request.input}
- Persona Style: {request.style}
- Cringe Level (1 to 10): {request.cringe_level}
- Post Length: {request.post_length}

INSTRUCTIONS FOR PERSONA:
- If "Hustle Guru": Emphasize waking up early, cold plunges, biohacking, outworking the competition, and monetizing breathing.
- If "Startup Founder": Focus on disruption, pivoting, "building in stealth", scaling ecosystems, and how this event revolutionized your SaaS metrics.
- If "Corporate Slave Turned Visionary": Focus on escaping the matrix, the toxicity of the 9-to-5, "finding your why", and the spiritual awakening of solopreneurship.
- If "The AI Evangelist": Turns the event into a post about how AI is replacing everyone who doesn't do this specific thing. (e.g., "If you are still eating breakfast manually in 2026, you are falling behind. Here is how I prompted my toaster...").
- If "The Over-Empathic Recruiter": Spins the event into a story about a fictional candidate they interviewed. (e.g., "Today, a candidate showed up to an interview eating toast. Most managers would reject them. I hired them on the spot. Here is why...").
- If "The Ex-FAANG Tech Lead": Inserts unnecessary software architecture metaphors into daily life. (e.g., "I realized my morning coffee routine wasn't scalable. So, I decoupled my espresso machine and refactored my mug...").
- If "The Overly-Enthusiastic Intern": Way too many emojis, tags 15 different mentors, and expresses deep gratitude for basic existence.

INSTRUCTIONS FOR POST LENGTH (MANDATORY AND ABSOLUTE):
- If "Short": The ENTIRE post MUST be strictly 2-3 sentences max. Absolutely no more. Ignore any other rule that suggests making it long.
- If "Medium": The ENTIRE post MUST be exactly 4-7 sentences total.
- If "Long": Make it an extensively long, drawn-out story spanning many very short paragraphs.

INSTRUCTIONS FOR CRINGE LEVEL:
- Level 1-3 (Low): Mild corporate jargon (synergy, bandwidth, aligning). A slightly exaggerated professional update.
- Level 4-7 (Medium): Heavy jargon, forced inspirational takeaways, and a bizarre pivot like "Here is what this taught me about B2B sales."
- Level 8-10 (High): Absolute unhinged lunacy. Extreme self-importance, totally fabricated dialogues with strangers, completely irrelevant life lessons, and aggressive use of emojis 🚀💡🔥.

FORMATTING RULES (CRITICAL):
1. Write exclusively in single-sentence paragraphs. 
2. Use double line breaks between EVERY single sentence.
3. Start with an unbelievable hook (e.g., "I used to think eating breakfast was a waste of time. I was wrong.").
4. End with a rhetorical question to drive "engagement" (e.g., "Do you agree?").
5. Append 5-7 highly ambitious, unrelated hashtags at the very bottom.

Generate the LinkedIn post now. Output ONLY the post content. Do not include any introductory or concluding text."""

        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents="Now generate the post based on the parameters provided.",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.8,
            ),
        )
        
        return {"post": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics")
def get_analytics(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != "aryankale1410@gmail.com" or credentials.password != "Aaryan@1410":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    
    supabase = get_supabase()
    if not supabase:
        return {"logs": [], "error": "Supabase not configured"}

    try:
        response = supabase.table("logs").select("*").order("timestamp", desc=True).execute()
        return {"logs": response.data}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

# This ensures uvicorn can be run locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
