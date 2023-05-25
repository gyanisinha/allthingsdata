import openai
import pandas as pd
import json
import os
from openbb_terminal.sdk import openbb

# Load config values
with open(r'config.json') as config_file:
    config_details = json.load(config_file)
    
# Setting up the deployment name
deployment_name = config_details['COMPLETIONS_MODEL']

# This is set to `azure`
openai.api_type = "azure"

# The base URL for your Azure OpenAI resource. e.g. "https://<your resource name>.openai.azure.com"
openai.api_base = config_details['OPENAI_API_BASE']

# The API key for your Azure OpenAI resource. Set env variable: setx OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE"
openai.api_key = os.getenv("OPENAI_API_KEY")
# or alternatively use below
# openai.api_key = "<enter value here>"

# Currently OPENAI API have the following versions available: 2022-12-01. All versions follow the YYYY-MM-DD date structure.
openai.api_version = config_details['OPENAI_API_VERSION']

# Function to get News headlines for a Ticker using OpenAI
def get_headlines(ticker):
    stocks_news = openbb.news(ticker)
    # print(stocks_news)
    news_df = pd.DataFrame(stocks_news)
    news_desc = news_df["Description"]
    return news_desc

# Function to get sentiment score for News headlines using OpenAI
def get_sentiment_score(text):
    prompt = f"Rate the sentiment of the following financial news headline: '{text}'. Use a scale from -1 (very negative) to 1 (very positive): "
    response = openai.Completion.create(engine=deployment_name, prompt=prompt, max_tokens=30, n=1, stop=None, temperature=0.5)
    score = float(response.choices[0].text.strip())
    return score

headlines = get_headlines("DLTR")

results = pd.DataFrame(columns=['News','Sentiment_Score'])

for item in headlines:
    sentiment_score = get_sentiment_score(item)
    rows = results.append({'News':item,'Sentiment_Score':sentiment_score}, ignore_index=True)
    results = pd.concat([results,rows])

print ("Sentiment analysis on news headlines for any stock using OpenAI and OpenBB SDKs\n")
print(results)
