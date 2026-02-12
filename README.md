# Reddit Data Analyzer - Educational Project

A Google Apps Script tool for collecting and analyzing public Reddit data for personal educational purposes.

## 📋 Project Overview

This is a **read-only, educational data analysis tool** that collects public posts from Reddit to learn about community engagement patterns and trending topics in technical communities. This project helps me develop skills in:
- API integration and OAuth2 authentication
- Data collection and organization
- Spreadsheet-based data analysis
- Understanding social media community dynamics

## 🎯 Purpose

**What this tool does:**
- Analyzes trending topics in programming communities (r/python, r/datascience)
- Studies what types of content generate the most engagement
- Identifies common questions and discussion patterns
- Helps understand how technical communities share knowledge

**Educational Goals:**
- Learn how to work with REST APIs
- Practice OAuth2 authentication implementation
- Develop data analysis skills
- Understand rate limiting and API best practices

## ✅ Compliance with Reddit's Responsible Builder Policy

This project fully complies with [Reddit's Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy):

### What This Tool WILL DO:
✅ Read-only access to public posts and comments  
✅ Collect data from 2-3 specified public subreddits only  
✅ Respect Reddit's rate limits (max 60 requests/minute)  
✅ Use official Reddit OAuth2 API with proper authentication  
✅ Store data locally in Google Sheets for personal analysis  
✅ Manual operation (user-triggered, not automated 24/7)  

### What This Tool will NOT DO:
❌ No automated posting or commenting  
❌ No voting (upvotes/downvotes)  
❌ No direct messaging to users  
❌ No modification of any Reddit content  
❌ No commercial use or selling of data  
❌ No training of AI/ML models with Reddit data  
❌ No data redistribution or public sharing  
❌ No accessing private or restricted subreddits  
❌ No user harassment or spam  
❌ No exceeding rate limits  

## 🔧 Technical Details

**Platform:** Google Apps Script (JavaScript)  
**Authentication:** Reddit OAuth2 API  
**Data Storage:** Google Sheets (local to user)  
**Access Type:** Read-only  

**API Endpoints Used:**
- `/r/{subreddit}/{sort}` - Get posts from subreddit
- `/r/{subreddit}/comments/{post_id}` - Get comments from post
- `/r/{subreddit}/about` - Get subreddit information
- `/search` - Search Reddit posts

**Request Volume:**
- Approximately 50-100 API calls per day
- Manual operation (1-2 runs per day)
- Well below Reddit's 60 requests/minute limit

**Target Subreddits:**
- r/python
- r/datascience
- r/learnprogramming (optional)

## 📊 Data Collected

The script collects only publicly available data:

**Post Data:**
- Post ID, Title, Author
- Score, Upvote Ratio
- Number of Comments
- Created Timestamp
- URL, Permalink
- Post Text (for self-posts)
- Flair, NSFW status
- Award counts

**Comment Data (optional):**
- Comment ID, Author
- Comment Body
- Score
- Created Timestamp
- Threading Depth
- Parent Comment ID

**Subreddit Metadata:**
- Subscriber count
- Description
- Active users
- Creation date

## 🚀 How It Works

1. User opens Google Sheet with script attached
2. User selects action from "Reddit Scraper" custom menu
3. Script prompts for parameters (subreddit name, limit, sort method)
4. Script authenticates with Reddit API using OAuth2
5. Script makes read-only API requests
6. Data is written to new sheet in the same Google Sheets file
7. User manually analyzes data in Google Sheets

**No automated scheduling** - All operations are manually triggered by the user.

## 📁 Data Storage & Usage

**Storage Location:**
- Local Google Sheets file (user's Google Drive)
- No external databases
- No cloud storage services

**Data Usage:**
- Personal analysis and learning only
- Understanding community trends
- Identifying popular content types
- Educational purposes

**Data NOT Used For:**
- Commercial purposes or revenue generation
- Training AI or machine learning models
- Selling, licensing, or redistributing to third parties
- Public sharing or creating derivative datasets
- Any purpose that violates Reddit's policies

## 🔒 Privacy & Security

**User Privacy:**
- Only collects publicly visible Reddit data
- No access to private messages or restricted content
- No collection of email addresses or personal identifiable information
- Usernames are collected as they appear publicly on Reddit

**API Credentials:**
- Client ID and Client Secret stored in script (user's private copy)
- Credentials never shared or committed to public repositories
- Each user must obtain their own Reddit API credentials

**Data Security:**
- Data stays within user's Google account
- No transmission to third-party services
- User has full control over their data

## 📖 Setup Instructions

### Prerequisites
1. Google Account (for Google Sheets)
2. Reddit Account
3. Reddit API Credentials (Client ID & Secret)

### Getting Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **name:** DataAnalyzer (or any name without "Reddit")
   - **App type:** Select "script"
   - **description:** Educational data analysis
   - **redirect uri:** `http://localhost:8080`
4. Click "Create app"
5. Copy your credentials:
   - **Client ID:** String under "personal use script"
   - **Client Secret:** Value after "secret:"

### Installation

1. Create a new Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete existing code
4. Copy and paste the code from `RedditScraper.gs`
5. Update the CONFIG section with your credentials:
   ```javascript
   const CONFIG = {
     CLIENT_ID: 'your_client_id_here',
     CLIENT_SECRET: 'your_client_secret_here',
     USER_AGENT: 'GoogleAppsScript:RedditScraper:v1.0'
   };
   ```
6. Save the project (Ctrl+S or File > Save)
7. Run the `setupSheet` function to create the menu
8. Authorize the script when prompted
9. Refresh your Google Sheet
10. Use the "Reddit Scraper" menu

## 📚 Usage Examples

### Example 1: Analyze Top Python Posts
```
Menu: Reddit Scraper > Scrape Subreddit Posts
Subreddit: python
Limit: 50
Sort: top
```
Result: Creates sheet "r_python_posts" with top 50 posts

### Example 2: Study Discussion Patterns
```
Menu: Reddit Scraper > Scrape Post Comments
Subreddit: datascience
Post ID: abc123
```
Result: Creates sheet "comments_abc123" with comment threads

### Example 3: Find Learning Resources
```
Menu: Reddit Scraper > Search Reddit
Query: machine learning tutorial
Subreddit: (leave blank)
```
Result: Creates sheet "search_machine learning" with results

## 🎓 Educational Value

This project teaches:
- **API Integration:** Understanding RESTful APIs and OAuth2
- **Data Collection:** Ethical web scraping practices
- **Data Analysis:** Working with real-world social media data
- **Rate Limiting:** Respecting API limits and best practices
- **Authentication:** Implementing secure API authentication
- **Data Ethics:** Understanding responsible data use

## ⚖️ Legal & Ethical Compliance

**Reddit's Terms of Service:**
- Complies with Reddit User Agreement
- Follows API Terms of Use
- Respects Responsible Builder Policy
- No violation of rate limits or usage restrictions

**Ethical Considerations:**
- Only public data collection
- No personally identifiable information collection
- Transparent about data usage
- Respects community guidelines
- Educational and non-commercial purpose

**Data Rights:**
- Reddit retains all rights to their data
- This tool does not claim ownership of collected data
- Data used under fair use for educational purposes
- No redistribution of Reddit content

## 📞 Support & Questions

This is a personal educational project. For questions about:
- **Reddit API:** https://www.reddit.com/dev/api
- **Reddit Policies:** https://support.reddithelp.com
- **Google Apps Script:** https://developers.google.com/apps-script

## ⚠️ Disclaimer

This tool is provided for educational purposes only. Users are responsible for:
- Obtaining their own Reddit API credentials
- Complying with Reddit's policies and terms of service
- Using collected data ethically and legally
- Not exceeding rate limits or abusing the API
- Ensuring their use case aligns with Reddit's Responsible Builder Policy

The author is not responsible for misuse of this tool or violation of Reddit's policies by users.

## 📝 License

This project is provided as-is for educational purposes. Users must:
- Comply with Reddit's API Terms of Use
- Follow the Responsible Builder Policy
- Use data ethically and legally
- Not use for commercial purposes without Reddit's approval

## 🔄 Version History

**v1.0** (February 2026)
- Initial release
- Basic subreddit post scraping
- Comment collection
- Search functionality
- Subreddit information retrieval
- Full compliance with Reddit's Responsible Builder Policy

## 📧 Responsible Use Statement

By using this tool, you agree to:
1. Use Reddit data only for personal, educational, non-commercial purposes
2. Not train AI or machine learning models with Reddit data
3. Not sell, license, or redistribute Reddit data
4. Respect Reddit's rate limits and API guidelines
5. Follow all applicable laws and Reddit's terms of service
6. Be transparent about your data collection practices
7. Respect user privacy and community guidelines

---

**This project demonstrates responsible API usage and ethical data collection practices while learning valuable programming and data analysis skills.**

For Reddit API approval or questions about compliance, contact Reddit directly through their official support channels.
