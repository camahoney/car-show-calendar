const { spawn } = require('child_process');

const connectionString = "postgresql://postgres:$Fragile1988!@db.tuhbqzblqsvixewethcp.supabase.co:5432/postgres";

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['vercel', 'env', 'add', 'DATABASE_URL', 'production'];

const child = spawn(cmd, args, { stdio: ['pipe', 'inherit', 'inherit'], shell: true });

// Wait a bit for the prompt "Mark as sensitive? (y/N)"
setTimeout(() => {
    console.log('Writing: y');
    child.stdin.write('y\n');

    // Wait for "What's the value?"
    setTimeout(() => {
        console.log('Writing connection string...');
        child.stdin.write(connectionString + '\n');

        // Allow process to finish writing/saving
        setTimeout(() => {
            child.stdin.end();
        }, 2000);
    }, 2000);
}, 3000);
