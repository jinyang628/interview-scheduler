# browse-with-u (Browzy)

An AI companion that browses the web WITH you, not for you.

The whole world is chasing after async agents that automate tasks without human involvement. Browzy takes a different approach by integrating AI capabilities into the existing human action flow. Think of it as a second pair of eyes that observes the webpage with you, providing you with personalized suggestions and recommendations based on your browsing history and preferences.

## How to run

```bash
pnpm i  # Install dependencies
pnpm dev # Start the development server
```

## How to build and unpack the extension in your browser

```bash
pnpm build # Build the extension

# Unpack the dist folder in your browser extensions page
```

### Hackathon Deliverables

- 3 minute demo
  > user is looking for food and agent finds him food that fits his itinerary and preferences (allergies etc)
  > user is filling up a job application for supabase and agent gives recommendations
  > user is writing a report, toggling between reading blogs/articles and his google doc, and agent gives suggestion
- 1 minute video
- 1 main visual

### Use Cases

- User is looking for food on Yelp and Browzy assists him by suggesting restaurants that fits his itinerary and preferences/allergies
- User is researching on a particular topic, Browzy helps to clarify difficult/relevant concepts on every unique site he visits
- User is applying for a job and Browzy assists him by suggesting job openings on the page that matches his skills and preferences\

### How does Browzy do it?

1. Browzy collects data from the page states visited by the user (url, text content, screenshot, etc.)
2. With this information, Browzy tries to guess the user's objective when browsing the web (if it is not given by the user)
3. Agent then provides suggestions/recommendations to these objectives based on two buckets of information - STM (short term memory) and LTM (long term memory)

- STM includes the current and previous page states for this particular user session
- LTM includes user defined profile information (resume, travel itinerary, google docs, mum's name, preferences, etc) that might or might not be relevant to any browsing session.

### Cool Features/Technical Details

1. A chat container is injected into the webpage that allows the user to interact with Browzy and view its suggestions easily.
2. Browzy automatically uploads relevant LTM information into our vector database based on a PDF file.
3. Browzy automatically collects and stores page states as the user browses the web (STM)
4. Browzy automatically trims the webpage text, url, etc. to only include "interesting" information.
5. Browzy proactively adds information to LTM based on trends drawn from STM

### User stories

- user is looking for food and agent finds him food that fits his itinerary and preferences (allergies etc)
  > user searches for "food near me"
  > popup shows "ramen nagi is 50 meters away from you, does not have peanuts" (based on LTM that user loves ramen and is allergic to peanuts)
- user is filling up a job application for supabase and agent gives recommendations

  > user is on the page for "job application for supabase"
  > popup returns resume in bullet points and user can easily crtl-c and crtl-v

- agent asks preference questions and adds to LTM
- press tab to autocomplete while filling up job application
- agent only collects page states when user is not in scrolling mode
- agent can interpret data from screenshots effectively.

Preference questions: yes/no questions regarding user preferences (do u like ramen? | are u allergic to peanuts?) + if not, what? (user can provide a text)

short term memory (page states) is collected by the pages he has visited
long term memory is user defined + user-added information based on preference questions

preference questions: yes/no questions to user preferences (do u like ramen? | are u allergic to peanuts?)
add-on: if not, what isit? (user can provide a text)

### Credits

[PNG Resizer](https://onlinepngtools.com/resize-png)

[Supabase](https://supabase.com/)

[Anthropic](https://www.anthropic.com/)

[OpenAI](https://openai.com/)

[WXT](https://wxt.dev/)

We used the React started template from [wxt-dev](https://github.com/wxt-dev/wxt/tree/main/templates/)
