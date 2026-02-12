/**
 * Reddit Data Scraper for Google Apps Script
 * This script scrapes Reddit data and saves it to Google Sheets
 * 
 * Setup Instructions:
 * 1. Get Reddit API credentials from https://www.reddit.com/prefs/apps
 * 2. Update the CONFIG object below with your credentials
 * 3. Run setupSheet() to create the menu
 * 4. Use the Reddit Scraper menu to scrape data
 */

// ================================
// CONFIGURATION
// ================================
const CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
  USER_AGENT: 'GoogleAppsScript:RedditScraper:v1.0'
};

// ================================
// REDDIT API AUTHENTICATION
// ================================

/**
 * Get Reddit access token
 */
function getRedditAccessToken() {
  const url = 'https://www.reddit.com/api/v1/access_token';
  
  const auth = Utilities.base64Encode(CONFIG.CLIENT_ID + ':' + CONFIG.CLIENT_SECRET);
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Basic ' + auth,
      'User-Agent': CONFIG.USER_AGENT
    },
    payload: {
      grant_type: 'client_credentials'
    },
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }
  } catch (error) {
    Logger.log('Error getting access token: ' + error);
    throw error;
  }
}

/**
 * Make authenticated request to Reddit API
 */
function makeRedditRequest(endpoint) {
  const token = getRedditAccessToken();
  
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + token,
      'User-Agent': CONFIG.USER_AGENT
    },
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch('https://oauth.reddit.com' + endpoint, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    Logger.log('Error making request: ' + error);
    throw error;
  }
}

// ================================
// SCRAPING FUNCTIONS
// ================================

/**
 * Scrape posts from a subreddit
 */
function scrapeSubredditPosts(subreddit, limit, sortBy) {
  subreddit = subreddit || 'python';
  limit = limit || 25;
  sortBy = sortBy || 'hot';
  
  const endpoint = `/r/${subreddit}/${sortBy}?limit=${limit}`;
  
  try {
    const data = makeRedditRequest(endpoint);
    const posts = [];
    
    if (data.data && data.data.children) {
      data.data.children.forEach(function(child) {
        const post = child.data;
        posts.push({
          'Post ID': post.id,
          'Title': post.title,
          'Author': post.author,
          'Subreddit': post.subreddit,
          'Score': post.score,
          'Upvote Ratio': post.upvote_ratio,
          'Comments': post.num_comments,
          'Created': new Date(post.created_utc * 1000),
          'URL': post.url,
          'Permalink': 'https://reddit.com' + post.permalink,
          'Text': post.selftext || '',
          'Is Self': post.is_self,
          'NSFW': post.over_18,
          'Flair': post.link_flair_text || '',
          'Awards': post.total_awards_received || 0
        });
      });
    }
    
    return posts;
  } catch (error) {
    Logger.log('Error scraping subreddit: ' + error);
    throw error;
  }
}

/**
 * Scrape comments from a specific post
 */
function scrapePostComments(subreddit, postId, limit) {
  subreddit = subreddit || 'python';
  limit = limit || 100;
  
  const endpoint = `/r/${subreddit}/comments/${postId}?limit=${limit}`;
  
  try {
    const data = makeRedditRequest(endpoint);
    const comments = [];
    
    if (data && data.length > 1 && data[1].data && data[1].data.children) {
      extractComments(data[1].data.children, comments, postId);
    }
    
    return comments;
  } catch (error) {
    Logger.log('Error scraping comments: ' + error);
    throw error;
  }
}

/**
 * Recursively extract comments
 */
function extractComments(children, comments, postId, depth) {
  depth = depth || 0;
  
  children.forEach(function(child) {
    if (child.kind === 't1' && child.data) {
      const comment = child.data;
      comments.push({
        'Comment ID': comment.id,
        'Post ID': postId,
        'Author': comment.author,
        'Body': comment.body,
        'Score': comment.score,
        'Created': new Date(comment.created_utc * 1000),
        'Depth': depth,
        'Parent ID': comment.parent_id,
        'Permalink': 'https://reddit.com' + comment.permalink,
        'Awards': comment.total_awards_received || 0
      });
      
      // Recursively get replies
      if (comment.replies && comment.replies.data && comment.replies.data.children) {
        extractComments(comment.replies.data.children, comments, postId, depth + 1);
      }
    }
  });
}

/**
 * Search Reddit
 */
function searchReddit(query, subreddit, limit) {
  query = query || 'machine learning';
  limit = limit || 25;
  
  let endpoint;
  if (subreddit) {
    endpoint = `/r/${subreddit}/search?q=${encodeURIComponent(query)}&limit=${limit}&restrict_sr=1`;
  } else {
    endpoint = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  }
  
  try {
    const data = makeRedditRequest(endpoint);
    const results = [];
    
    if (data.data && data.data.children) {
      data.data.children.forEach(function(child) {
        const post = child.data;
        results.push({
          'Post ID': post.id,
          'Title': post.title,
          'Author': post.author,
          'Subreddit': post.subreddit,
          'Score': post.score,
          'Comments': post.num_comments,
          'Created': new Date(post.created_utc * 1000),
          'URL': post.url,
          'Permalink': 'https://reddit.com' + post.permalink
        });
      });
    }
    
    return results;
  } catch (error) {
    Logger.log('Error searching Reddit: ' + error);
    throw error;
  }
}

/**
 * Get subreddit information
 */
function getSubredditInfo(subreddit) {
  subreddit = subreddit || 'python';
  
  const endpoint = `/r/${subreddit}/about`;
  
  try {
    const data = makeRedditRequest(endpoint);
    
    if (data.data) {
      const sub = data.data;
      return [{
        'Name': sub.display_name,
        'Title': sub.title,
        'Description': sub.public_description,
        'Subscribers': sub.subscribers,
        'Active Users': sub.active_user_count || 'N/A',
        'Created': new Date(sub.created_utc * 1000),
        'NSFW': sub.over18,
        'URL': 'https://reddit.com' + sub.url
      }];
    }
    
    return [];
  } catch (error) {
    Logger.log('Error getting subreddit info: ' + error);
    throw error;
  }
}

// ================================
// GOOGLE SHEETS FUNCTIONS
// ================================

/**
 * Write data to sheet
 */
function writeToSheet(sheetName, data) {
  if (!data || data.length === 0) {
    SpreadsheetApp.getUi().alert('No data to write!');
    return;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    // Clear existing content
    sheet.clear();
  }
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Write headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  // Write data
  const rows = data.map(function(obj) {
    return headers.map(function(header) {
      return obj[header];
    });
  });
  
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  SpreadsheetApp.getUi().alert('Data written to sheet: ' + sheetName);
}

// ================================
// UI FUNCTIONS
// ================================

/**
 * Create custom menu on open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Reddit Scraper')
    .addItem('Scrape Subreddit Posts', 'promptScrapeSubreddit')
    .addItem('Scrape Post Comments', 'promptScrapeComments')
    .addItem('Search Reddit', 'promptSearchReddit')
    .addItem('Get Subreddit Info', 'promptSubredditInfo')
    .addSeparator()
    .addItem('About', 'showAbout')
    .addToUi();
}

/**
 * Setup function to initialize the script
 */
function setupSheet() {
  onOpen();
  SpreadsheetApp.getUi().alert('Reddit Scraper menu created! Refresh the page to see it.');
}

/**
 * Prompt user to scrape subreddit
 */
function promptScrapeSubreddit() {
  const ui = SpreadsheetApp.getUi();
  
  const subredditResponse = ui.prompt('Scrape Subreddit', 'Enter subreddit name (without r/):', ui.ButtonSet.OK_CANCEL);
  if (subredditResponse.getSelectedButton() !== ui.Button.OK) return;
  const subreddit = subredditResponse.getResponseText();
  
  const limitResponse = ui.prompt('Limit', 'Number of posts to scrape (1-100):', ui.ButtonSet.OK_CANCEL);
  if (limitResponse.getSelectedButton() !== ui.Button.OK) return;
  const limit = parseInt(limitResponse.getResponseText()) || 25;
  
  const sortResponse = ui.prompt('Sort By', 'Sort by (hot/new/top/rising/controversial):', ui.ButtonSet.OK_CANCEL);
  if (sortResponse.getSelectedButton() !== ui.Button.OK) return;
  const sortBy = sortResponse.getResponseText() || 'hot';
  
  try {
    ui.alert('Scraping r/' + subreddit + '... Please wait.');
    const posts = scrapeSubredditPosts(subreddit, limit, sortBy);
    writeToSheet('r_' + subreddit + '_posts', posts);
  } catch (error) {
    ui.alert('Error: ' + error.message);
  }
}

/**
 * Prompt user to scrape comments
 */
function promptScrapeComments() {
  const ui = SpreadsheetApp.getUi();
  
  const subredditResponse = ui.prompt('Scrape Comments', 'Enter subreddit name:', ui.ButtonSet.OK_CANCEL);
  if (subredditResponse.getSelectedButton() !== ui.Button.OK) return;
  const subreddit = subredditResponse.getResponseText();
  
  const postIdResponse = ui.prompt('Post ID', 'Enter post ID:', ui.ButtonSet.OK_CANCEL);
  if (postIdResponse.getSelectedButton() !== ui.Button.OK) return;
  const postId = postIdResponse.getResponseText();
  
  try {
    ui.alert('Scraping comments... Please wait.');
    const comments = scrapePostComments(subreddit, postId, 100);
    writeToSheet('comments_' + postId, comments);
  } catch (error) {
    ui.alert('Error: ' + error.message);
  }
}

/**
 * Prompt user to search Reddit
 */
function promptSearchReddit() {
  const ui = SpreadsheetApp.getUi();
  
  const queryResponse = ui.prompt('Search Reddit', 'Enter search query:', ui.ButtonSet.OK_CANCEL);
  if (queryResponse.getSelectedButton() !== ui.Button.OK) return;
  const query = queryResponse.getResponseText();
  
  const subredditResponse = ui.prompt('Subreddit (Optional)', 'Limit to subreddit (leave blank for all):', ui.ButtonSet.OK_CANCEL);
  if (subredditResponse.getSelectedButton() !== ui.Button.OK) return;
  const subreddit = subredditResponse.getResponseText() || null;
  
  try {
    ui.alert('Searching... Please wait.');
    const results = searchReddit(query, subreddit, 25);
    writeToSheet('search_' + query.substring(0, 20), results);
  } catch (error) {
    ui.alert('Error: ' + error.message);
  }
}

/**
 * Prompt user to get subreddit info
 */
function promptSubredditInfo() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.prompt('Subreddit Info', 'Enter subreddit name:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;
  const subreddit = response.getResponseText();
  
  try {
    const info = getSubredditInfo(subreddit);
    writeToSheet('info_' + subreddit, info);
  } catch (error) {
    ui.alert('Error: ' + error.message);
  }
}

/**
 * Show about dialog
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Reddit Scraper for Google Sheets',
    'Version 1.0\n\n' +
    'This script uses Reddit API to scrape data.\n\n' +
    'Setup:\n' +
    '1. Get API credentials from reddit.com/prefs/apps\n' +
    '2. Update CONFIG in the script code\n' +
    '3. Use the menu to scrape data\n\n' +
    'Data is saved to new sheets automatically.',
    ui.ButtonSet.OK
  );
}
