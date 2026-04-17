import fs from 'fs';

const USERNAME = 'jtovarto';

async function fetchGitHubData() {
  const response = await fetch(`https://api.github.com/users/${USERNAME}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
  }
  return response.json();
}

function calculateUptime(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function updateReadme() {
  try {
    const data = await fetchGitHubData();
    const uptimeDays = calculateUptime(data.created_at);
    
    // We maintain the hardcoded aesthetic entries where it makes sense,
    // but update dynamic numbers based on real API data.
    const newStatsText = `
OS        macOS / iOS / Android Run-loops
Kernel    Mobile Core + AI Agents Ext.
Uptime    ~${uptimeDays} days (GitHub Account Lifetime)
Packages  ${data.public_repos} (public repos), others private
Followers ${data.followers} developers connected
Memory    Fully allocated to Unit1 App V3
Disk      Brain SSD heavily fragmented by HW Prototypes
`;

    const readmePath = 'README.md';
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Use regex to replace the content between the tags, ensuring we add newline chars properly
    const regex = /(<!--\s*DYNAMIC_STATS_START\s*-->)[\s\S]*?(<!--\s*DYNAMIC_STATS_END\s*-->)/;
    readmeContent = readmeContent.replace(regex, `$1\n${newStatsText.trim()}\n$2`);

    fs.writeFileSync(readmePath, readmeContent);
    console.log('README.md updated successfully with dynamic stats.');
  } catch (error) {
    console.error('Error updating README:', error);
    process.exit(1);
  }
}

updateReadme();
