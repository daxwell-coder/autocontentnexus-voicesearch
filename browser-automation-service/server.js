const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { chromium } = require('playwright');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many automation requests from this IP'
});
app.use('/automation', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main automation endpoint
app.post('/automation/awin-applications', async (req, res) => {
  let browser = null;
  
  try {
    const { credentials, programs, userProfile, sessionId } = req.body;
    
    if (!credentials || !credentials.email || !credentials.password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CREDENTIALS', message: 'AWIN credentials required' }
      });
    }
    
    if (!programs || programs.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_PROGRAMS', message: 'No programs specified for automation' }
      });
    }

    // Launch browser
    console.log(`Starting automation for session ${sessionId}`);
    browser = await chromium.launch({
      headless: false, // Show browser for user interaction
      slowMo: 1000 // Slow down for visibility
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    const results = [];
    
    try {
      // Step 1: Login to AWIN
      console.log('Navigating to AWIN login page...');
      await page.goto('https://ui.awin.com/merchant-profile/login', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Handle potential cookie banner
      try {
        await page.waitForSelector('[data-testid="accept-all-cookies"]', { timeout: 3000 });
        await page.click('[data-testid="accept-all-cookies"]');
        await page.waitForTimeout(1000);
      } catch (e) {
        // Cookie banner might not be present
      }
      
      // Fill login form
      console.log('Filling login credentials...');
      await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
      await page.fill('input[name="email"], input[type="email"]', credentials.email);
      await page.fill('input[name="password"], input[type="password"]', credentials.password);
      
      // Submit login form
      await page.click('button[type="submit"], input[type="submit"], .login-button');
      
      // Wait for successful login
      await page.waitForURL(/ui\.awin\.com\/affiliate/, { timeout: 30000 });
      console.log('Successfully logged in to AWIN');
      
      // Step 2: Process each program
      for (const program of programs) {
        try {
          console.log(`Processing program: ${program.name}`);
          
          // Navigate to program application page
          const applicationUrl = `https://ui.awin.com/affiliate/join-programme/${program.program_id}`;
          await page.goto(applicationUrl, { waitUntil: 'networkidle', timeout: 30000 });
          
          // Check if already applied or approved
          const pageContent = await page.content();
          if (pageContent.includes('already applied') || pageContent.includes('already a member')) {
            results.push({
              program_id: program.program_id,
              program_name: program.name,
              status: 'already_applied',
              message: 'Program already applied to or member of'
            });
            continue;
          }
          
          // Look for application form
          const applicationForm = await page.$('form, .application-form, [data-testid="application-form"]');
          if (!applicationForm) {
            results.push({
              program_id: program.program_id,
              program_name: program.name,
              status: 'no_form_found',
              message: 'No application form found on page'
            });
            continue;
          }
          
          // Pre-fill form fields based on common AWIN form patterns
          await fillAwinApplicationForm(page, userProfile, program);
          
          // Pause for user review
          console.log(`\n=== REVIEW REQUIRED ===`);
          console.log(`Program: ${program.name}`);
          console.log(`Merchant: ${program.merchant}`);
          console.log('\nApplication form has been pre-filled.');
          console.log('Please review the form and submit manually when ready.');
          console.log('Press Enter in the console when you have submitted or want to skip...');
          
          // Wait for user input (in production, this would be a more sophisticated notification)
          await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
          });
          
          // Check if application was submitted by looking for success indicators
          const currentUrl = page.url();
          const newPageContent = await page.content();
          
          if (currentUrl.includes('success') || newPageContent.includes('application submitted') || 
              newPageContent.includes('thank you') || newPageContent.includes('pending')) {
            results.push({
              program_id: program.program_id,
              program_name: program.name,
              status: 'submitted',
              message: 'Application submitted successfully'
            });
          } else {
            results.push({
              program_id: program.program_id,
              program_name: program.name,
              status: 'review_required',
              message: 'Form pre-filled, manual review completed'
            });
          }
          
        } catch (programError) {
          console.error(`Error processing program ${program.program_id}:`, programError.message);
          results.push({
            program_id: program.program_id,
            program_name: program.name,
            status: 'error',
            message: `Error: ${programError.message}`,
            error: programError.message
          });
        }
        
        // Small delay between programs
        await page.waitForTimeout(2000);
      }
      
    } catch (loginError) {
      throw new Error(`Login failed: ${loginError.message}`);
    }
    
    console.log('Automation completed. Results:', results);
    
    res.json({
      success: true,
      data: {
        sessionId,
        results,
        totalProcessed: results.length,
        successful: results.filter(r => r.status === 'submitted').length,
        errors: results.filter(r => r.status === 'error').length
      }
    });
    
  } catch (error) {
    console.error('Automation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTOMATION_FAILED',
        message: error.message
      }
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Helper function to fill AWIN application forms
async function fillAwinApplicationForm(page, userProfile, program) {
  const fields = {
    // Common AWIN form fields
    'website': userProfile.website_url || '',
    'website_url': userProfile.website_url || '',
    'site_url': userProfile.website_url || '',
    'company_name': userProfile.company_name || '',
    'business_name': userProfile.company_name || '',
    'organization': userProfile.company_name || '',
    'audience_size': userProfile.audience_size || '',
    'monthly_visitors': userProfile.audience_size || '',
    'traffic': userProfile.audience_size || ''
  };
  
  // Fill text inputs
  for (const [fieldName, value] of Object.entries(fields)) {
    if (value) {
      const selectors = [
        `input[name="${fieldName}"]`,
        `input[id="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `textarea[id="${fieldName}"]`
      ];
      
      for (const selector of selectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await element.fill(value);
            console.log(`Filled ${fieldName}: ${value}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    }
  }
  
  // Handle promotional methods checkboxes/radio buttons
  if (userProfile.promotional_methods) {
    const methods = Array.isArray(userProfile.promotional_methods) 
      ? userProfile.promotional_methods 
      : [userProfile.promotional_methods];
    
    for (const method of methods) {
      const methodSelectors = [
        `input[value*="${method.toLowerCase()}"]`,
        `input[id*="${method.toLowerCase()}"]`,
        `label:has-text("${method}")`
      ];
      
      for (const selector of methodSelectors) {
        try {
          const element = await page.$(selector);
          if (element && await element.getAttribute('type') === 'checkbox') {
            await element.check();
            console.log(`Selected promotional method: ${method}`);
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    }
  }
  
  // Fill application reason/description
  const description = `I operate ${userProfile.company_name || 'a website'} focused on ${program.sector || 'affiliate marketing'} with expertise in ${program.niches?.join(', ') || 'content creation'}. I believe this partnership would be mutually beneficial for promoting quality products to my engaged audience.`;
  
  const descriptionSelectors = [
    'textarea[name*="reason"]',
    'textarea[name*="description"]',
    'textarea[name*="comment"]',
    'textarea[name*="message"]',
    'textarea[id*="reason"]',
    'textarea[id*="description"]'
  ];
  
  for (const selector of descriptionSelectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        await element.fill(description);
        console.log('Filled application description');
        break;
      }
    } catch (e) {
      // Continue
    }
  }
  
  console.log('Form pre-filling completed');
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    }
  });
});

app.listen(PORT, () => {
  console.log(`AWIN Automation Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;