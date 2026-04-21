// Docker Sandbox - Interactive Learning Script

// State management
const state = {
    containers: [],
    images: ['nginx:latest', 'redis:alpine', 'node:16-alpine', 'python:3.9-slim', 'ubuntu:20.04'],
    networks: ['bridge', 'host', 'none'],
    volumes: [],
    commandsRun: 0,
    challengesCompleted: [],
    totalPoints: 0,
    currentChallenge: null
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('dockerSandboxProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        state.challengesCompleted = parsed.challengesCompleted || [];
        state.totalPoints = parsed.totalPoints || 0;
        state.commandsRun = parsed.commandsRun || 0;
        updateProgressDisplay();
        markCompletedChallenges();
    }
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        challengesCompleted: state.challengesCompleted,
        totalPoints: state.totalPoints,
        commandsRun: state.commandsRun
    };
    localStorage.setItem('dockerSandboxProgress', JSON.stringify(progress));
}

// Terminal functionality
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.querySelector('.terminal-output');

terminalInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = this.value.trim();
        if (command) {
            executeCommand(command);
            this.value = '';
        }
    }
});

function runCommand(cmd) {
    terminalInput.value = cmd;
    terminalInput.focus();
}

function clearTerminal() {
    terminalOutput.innerHTML = '<div class="welcome-message">Terminal cleared.<br>Type \'help\' to see available commands.</div>';
}

function addToTerminal(text, type = 'output') {
    const line = document.createElement('div');
    line.className = type;
    
    if (type === 'command') {
        line.innerHTML = `<span class="prompt">docker@sandbox:~$</span> ${text}`;
    } else if (type === 'error') {
        line.style.color = '#ff6b6b';
        line.textContent = `Error: ${text}`;
    } else if (type === 'success') {
        line.style.color = '#4ecdc4';
        line.textContent = text;
    } else {
        line.innerHTML = text;
    }
    
    terminalOutput.appendChild(line);
    const terminalBody = document.getElementById('terminal');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function executeCommand(command) {
    state.commandsRun++;
    updateProgressDisplay();
    saveProgress();
    
    addToTerminal(command, 'command');
    
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Simulate Docker commands
    if (cmd === 'help') {
        showHelp();
    } else if (cmd === 'docker') {
        handleDockerCommand(args);
    } else if (cmd === 'clear' || cmd === 'cls') {
        clearTerminal();
    } else if (cmd === 'ls' || cmd === 'dir') {
        addToTerminal('Dockerfile  README.md  app.js  package.json');
    } else if (cmd === 'pwd') {
        addToTerminal('/home/docker/sandbox');
    } else if (cmd === 'whoami') {
        addToTerminal('docker');
    } else if (cmd === 'echo') {
        addToTerminal(args.join(' '));
    } else if (cmd === 'date') {
        addToTerminal(new Date().toString());
    } else if (cmd === 'uname') {
        if (args.includes('-a')) {
            addToTerminal('Linux sandbox 5.15.0-generic #1 SMP x86_64 GNU/Linux');
        } else {
            addToTerminal('Linux');
        }
    } else {
        addToTerminal(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
    
    // Check challenge completion
    checkChallengeCompletion(command);
}

function showHelp() {
    const helpText = `
<div style="color: #4ecdc4; margin: 1rem 0;">Available Commands:</div>
<div style="margin-left: 1rem; line-height: 1.8;">
    <strong style="color: #0db7ed;">docker ps</strong> - List running containers<br>
    <strong style="color: #0db7ed;">docker images</strong> - List all images<br>
    <strong style="color: #0db7ed;">docker run</strong> - Run a container<br>
    <strong style="color: #0db7ed;">docker stop</strong> - Stop a container<br>
    <strong style="color: #0db7ed;">docker rm</strong> - Remove a container<br>
    <strong style="color: #0db7ed;">docker network ls</strong> - List networks<br>
    <strong style="color: #0db7ed;">docker volume ls</strong> - List volumes<br>
    <strong style="color: #0db7ed;">docker info</strong> - Show Docker system information<br>
    <strong style="color: #0db7ed;">docker build</strong> - Build an image from Dockerfile<br>
    <strong style="color: #0db7ed;">clear</strong> - Clear terminal<br>
    <strong style="color: #0db7ed;">help</strong> - Show this help message
</div>
`;
    addToTerminal(helpText);
}

function handleDockerCommand(args) {
    const subCmd = args[0];
    
    switch(subCmd) {
        case 'ps':
            if (state.containers.length === 0) {
                addToTerminal('CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES');
            } else {
                let output = 'CONTAINER ID   IMAGE               COMMAND                  CREATED          STATUS         PORTS                    NAMES\n';
                output += '-'.repeat(100) + '\n';
                state.containers.forEach((c, i) => {
                    const id = c.id.substring(0, 12);
                    output += `${id}   ${c.image.padEnd(20)} "${c.command}"   ${c.created}   ${c.status}   ${c.ports || '-'}   ${c.name}\n`;
                });
                addToTerminal(output);
            }
            break;
            
        case 'images':
            let imgOutput = 'REPOSITORY           TAG       IMAGE ID       SIZE\n';
            imgOutput += '-'.repeat(70) + '\n';
            state.images.forEach(img => {
                const [repo, tag] = img.split(':');
                const imgId = Math.random().toString(16).substring(2, 14);
                const size = Math.floor(Math.random() * 500) + 50;
                imgOutput += `${repo.padEnd(20)} ${tag || 'latest'.padEnd(10)} ${imgId}   ${size}MB\n`;
            });
            addToTerminal(imgOutput);
            break;
            
        case 'run':
            handleRunCommand(args.slice(1));
            break;
            
        case 'stop':
            if (args.length < 2) {
                addToTerminal('Error: Please specify container name or ID', 'error');
            } else {
                const containerName = args[1];
                const container = state.containers.find(c => c.name === containerName || c.id.startsWith(containerName));
                if (container) {
                    container.status = 'Exited';
                    addToTerminal(containerName);
                } else {
                    addToTerminal(`Error: No such container: ${containerName}`, 'error');
                }
            }
            break;
            
        case 'start':
            if (args.length < 2) {
                addToTerminal('Error: Please specify container name or ID', 'error');
            } else {
                const containerName = args[1];
                const container = state.containers.find(c => c.name === containerName || c.id.startsWith(containerName));
                if (container) {
                    container.status = 'Up';
                    addToTerminal(containerName);
                } else {
                    addToTerminal(`Error: No such container: ${containerName}`, 'error');
                }
            }
            break;
            
        case 'rm':
            if (args.length < 2) {
                addToTerminal('Error: Please specify container name or ID', 'error');
            } else {
                const containerName = args[1];
                const index = state.containers.findIndex(c => c.name === containerName || c.id.startsWith(containerName));
                if (index !== -1) {
                    if (state.containers[index].status === 'Up') {
                        addToTerminal(`Error: Cannot remove running container. Stop it first with 'docker stop ${containerName}'`, 'error');
                    } else {
                        state.containers.splice(index, 1);
                        addToTerminal(containerName);
                    }
                } else {
                    addToTerminal(`Error: No such container: ${containerName}`, 'error');
                }
            }
            break;
            
        case 'rmi':
            if (args.length < 2) {
                addToTerminal('Error: Please specify image name or ID', 'error');
            } else {
                const imageName = args[1];
                const index = state.images.findIndex(img => img.startsWith(imageName));
                if (index !== -1) {
                    state.images.splice(index, 1);
                    addToTerminal(`Untagged and deleted: ${imageName}`);
                } else {
                    addToTerminal(`Error: No such image: ${imageName}`, 'error');
                }
            }
            break;
            
        case 'network':
            handleNetworkCommand(args.slice(1));
            break;
            
        case 'volume':
            handleVolumeCommand(args.slice(1));
            break;
            
        case 'build':
            handleBuildCommand(args);
            break;
            
        case 'info':
            showDockerInfo();
            break;
            
        case 'logs':
            if (args.length < 2) {
                addToTerminal('Error: Please specify container name or ID', 'error');
            } else {
                const containerName = args[1];
                const container = state.containers.find(c => c.name === containerName || c.id.startsWith(containerName));
                if (container) {
                    addToTerminal(`[INFO] Starting ${container.image}...\n[INFO] Server listening on port ${container.ports || '80'}\n[INFO] Ready to accept connections`);
                } else {
                    addToTerminal(`Error: No such container: ${containerName}`, 'error');
                }
            }
            break;
            
        case 'exec':
            addToTerminal('Interactive exec session started (simulated)');
            break;
            
        default:
            addToTerminal(`Error: Unknown docker command '${subCmd}'. Type 'help' for available commands.`, 'error');
    }
}

function handleRunCommand(args) {
    let detached = false;
    let ports = null;
    let name = null;
    let network = null;
    let volumes = null;
    let imageName = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-d') {
            detached = true;
        } else if (args[i] === '-p' && args[i + 1]) {
            ports = args[++i];
        } else if (args[i] === '--name' && args[i + 1]) {
            name = args[++i];
        } else if (args[i] === '--network' && args[i + 1]) {
            network = args[++i];
        } else if (args[i] === '-v' && args[i + 1]) {
            volumes = args[++i];
        } else if (!args[i].startsWith('-')) {
            imageName = args[i];
        }
    }
    
    if (!imageName) {
        addToTerminal('Error: Please specify an image name', 'error');
        return;
    }
    
    const container = {
        id: Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2),
        image: imageName,
        command: '/docker-entrypoint.sh',
        created: 'Just now',
        status: detached ? 'Up' : 'Running',
        ports: ports,
        name: name || imageName.split(':')[0] + '_' + Math.random().toString(16).substring(2, 6),
        network: network,
        volumes: volumes
    };
    
    state.containers.push(container);
    
    if (detached) {
        addToTerminal(container.id.substring(0, 12));
    } else {
        addToTerminal(`Starting container ${container.name}...\nPress Ctrl+C to stop`);
    }
}

function handleNetworkCommand(args) {
    const subCmd = args[0];
    
    if (subCmd === 'ls') {
        let output = 'NETWORK ID     NAME              DRIVER    SCOPE\n';
        output += '-'.repeat(60) + '\n';
        state.networks.forEach(net => {
            const netId = Math.random().toString(16).substring(2, 14);
            output += `${netId}   ${net.padEnd(18)} bridge    local\n`;
        });
        addToTerminal(output);
    } else if (subCmd === 'create' && args[1]) {
        const networkName = args[1];
        if (!state.networks.includes(networkName)) {
            state.networks.push(networkName);
            addToTerminal(Math.random().toString(16).substring(2, 14));
        } else {
            addToTerminal(`Error: Network already exists: ${networkName}`, 'error');
        }
    } else if (subCmd === 'inspect' && args[1]) {
        const networkName = args[1];
        if (state.networks.includes(networkName)) {
            const inspectOutput = `[
    {
        "Name": "${networkName}",
        "Id": "${Math.random().toString(16).substring(2, 14)}",
        "Driver": "bridge",
        "Scope": "local"
    }
]`;
            addToTerminal(inspectOutput);
        } else {
            addToTerminal(`Error: Network not found: ${networkName}`, 'error');
        }
    } else {
        addToTerminal('Usage: docker network [ls|create|inspect]', 'error');
    }
}

function handleVolumeCommand(args) {
    const subCmd = args[0];
    
    if (subCmd === 'ls') {
        let output = 'DRIVER    VOLUME NAME\n';
        output += '-'.repeat(40) + '\n';
        if (state.volumes.length === 0) {
            output += '(no volumes)';
        } else {
            state.volumes.forEach(vol => {
                output += `local     ${vol}\n`;
            });
        }
        addToTerminal(output);
    } else if (subCmd === 'create' && args[1]) {
        const volumeName = args[1];
        if (!state.volumes.includes(volumeName)) {
            state.volumes.push(volumeName);
            addToTerminal(volumeName);
        } else {
            addToTerminal(`Error: Volume already exists: ${volumeName}`, 'error');
        }
    } else {
        addToTerminal('Usage: docker volume [ls|create]', 'error');
    }
}

function handleBuildCommand(args) {
    let dockerfilePath = '.';
    let tagName = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-t' && args[i + 1]) {
            tagName = args[++i];
        } else if (!args[i].startsWith('-')) {
            dockerfilePath = args[i];
        }
    }
    
    addToTerminal(`Sending build context to Docker daemon  2.048kB\n`);
    setTimeout(() => {
        addToTerminal(`Step 1/6 : FROM node:16-alpine\n ---> abc123def456\n`);
    }, 500);
    setTimeout(() => {
        addToTerminal(`Step 2/6 : WORKDIR /app\n ---> Running in container123\n`);
    }, 1000);
    setTimeout(() => {
        addToTerminal(`Step 3/6 : COPY package*.json ./\n ---> abc789xyz\n`);
    }, 1500);
    setTimeout(() => {
        addToTerminal(`Step 4/6 : RUN npm install\n ---> Installing dependencies...\n`);
    }, 2000);
    setTimeout(() => {
        addToTerminal(`Step 5/6 : COPY . .\n ---> def456uvw\n`);
    }, 2500);
    setTimeout(() => {
        addToTerminal(`Step 6/6 : CMD ["npm", "start"]\n ---> Successfully built\n`);
    }, 3000);
    setTimeout(() => {
        const imageId = Math.random().toString(16).substring(2, 14);
        if (tagName) {
            addToTerminal(`Successfully tagged ${tagName}\n${imageId}`);
            state.images.push(tagName);
        } else {
            addToTerminal(`${imageId}`);
        }
    }, 3500);
}

function showDockerInfo() {
    const info = `
Client:
 Version:           20.10.21
 API version:       1.41
 Go version:        go1.18.7
 Git commit:        baeda1f
 Built:             Tue Oct 25 18:01:00 2022
 OS/Arch:           linux/amd64
 Context:           default

Server:
 Engine:
  Version:          20.10.21
  API version:      1.41
  Go version:       go1.18.7
  Git commit:       42c8f3e
  Built:            Tue Oct 25 18:01:00 2022
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.8
  GitCommit:        9cd3357b7fd7218e4aec3eae239db1f68a5a6ec6
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 Docker Desktop:
  Version:          4.14.0
  Compose Version:  v2.12.2

Containers: ${state.containers.length}
 Running: ${state.containers.filter(c => c.status === 'Up').length}
 Paused: 0
 Stopped: ${state.containers.filter(c => c.status === 'Exited').length}
Images: ${state.images.length}
Runtimes: runc io.containerd.runc.v2
Default Runtime: runc
Security Options: seccomp profile=default
Kernel Version: 5.15.0-generic
Operating System: Ubuntu 20.04 LTS
OSType: linux
Architecture: x86_64
CPUs: 4
Total Memory: 7.775GiB
ID: ${Math.random().toString(16).substring(2, 14)}:${Math.random().toString(16).substring(2, 14)}
Docker Root Dir: /var/lib/docker
Debug Mode: false
Registry: https://index.docker.io/v1/
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
`;
    addToTerminal(info);
}

// Challenge system
const challenges = {
    challenge1: {
        id: 'challenge1',
        name: 'Run Your First Container',
        required: ['docker', 'run', '-d', '-p', '80:80', 'nginx'],
        points: 10,
        completed: false
    },
    challenge2: {
        id: 'challenge2',
        name: 'Create a Custom Network',
        required: ['docker', 'network', 'create', 'my-app-network'],
        points: 15,
        completed: false
    },
    challenge3: {
        id: 'challenge3',
        name: 'Multi-Container Setup',
        steps: ['network', 'nginx', 'redis'],
        points: 25,
        completed: false
    },
    challenge4: {
        id: 'challenge4',
        name: 'Persistent Data with Volumes',
        required: ['volume', '-v'],
        points: 30,
        completed: false
    },
    challenge5: {
        id: 'challenge5',
        name: 'Build from Dockerfile',
        required: ['docker', 'build', '-t'],
        points: 50,
        completed: false
    },
    challenge6: {
        id: 'challenge6',
        name: 'Container Orchestration',
        complex: true,
        points: 60,
        completed: false
    }
};

function startChallenge(challengeId) {
    state.currentChallenge = challengeId;
    const challenge = challenges[challengeId];
    
    addToTerminal(`\n🎯 CHALLENGE STARTED: ${challenge.name}`, 'success');
    addToTerminal(`Points: ${challenge.points}\n`);
    addToTerminal('Complete the challenge by entering the correct Docker commands.\n');
    
    // Scroll to terminal
    document.getElementById('practice').scrollIntoView({ behavior: 'smooth' });
    terminalInput.focus();
}

function checkChallengeCompletion(command) {
    if (!state.currentChallenge) return;
    
    const challenge = challenges[state.currentChallenge];
    const cmdParts = command.toLowerCase().split(' ');
    
    let completed = false;
    
    if (challenge.required) {
        completed = challenge.required.every(word => 
            command.toLowerCase().includes(word.toLowerCase())
        );
    } else if (challenge.steps) {
        // Multi-step challenge tracking
        if (!challenge.currentStep) challenge.currentStep = 0;
        
        if (challenge.currentStep === 0 && command.includes('network create')) {
            challenge.currentStep = 1;
            addToTerminal('\n✓ Step 1 complete! Now run nginx container on this network.', 'success');
        } else if (challenge.currentStep === 1 && command.includes('run') && command.includes('nginx')) {
            challenge.currentStep = 2;
            addToTerminal('\n✓ Step 2 complete! Now run redis container.', 'success');
        } else if (challenge.currentStep === 2 && command.includes('run') && command.includes('redis')) {
            completed = true;
        }
    } else if (challenge.complex) {
        // Complex challenge - check for multiple elements
        const hasNetwork = command.includes('--network') || command.includes('network create');
        const hasVolume = command.includes('-v') || command.includes('volume');
        const hasHealthCheck = command.includes('--health-cmd') || command.includes('healthcheck');
        
        if (hasNetwork && hasVolume && hasHealthCheck) {
            completed = true;
        }
    }
    
    if (completed && !challenge.completed) {
        challenge.completed = true;
        state.challengesCompleted.push(challenge.id);
        state.totalPoints += challenge.points;
        state.currentChallenge = null;
        
        addToTerminal(`\n🎉 CHALLENGE COMPLETED!`, 'success');
        addToTerminal(`+${challenge.points} points\n`, 'success');
        
        // Mark card as completed
        const card = document.querySelector(`[onclick="startChallenge('${challenge.id}')"]`).closest('.challenge-card');
        if (card) {
            card.classList.add('completed');
            const btn = card.querySelector('.btn-challenge');
            btn.textContent = '✓ Completed';
            btn.disabled = true;
        }
        
        updateProgressDisplay();
        saveProgress();
    }
}

function markCompletedChallenges() {
    state.challengesCompleted.forEach(id => {
        const card = document.querySelector(`[onclick="startChallenge('${id}')"]`)?.closest('.challenge-card');
        if (card) {
            card.classList.add('completed');
            const btn = card.querySelector('.btn-challenge');
            if (btn) {
                btn.textContent = '✓ Completed';
                btn.disabled = true;
            }
        }
    });
}

function updateProgressDisplay() {
    document.getElementById('total-points').textContent = state.totalPoints;
    document.getElementById('challenges-completed').textContent = `${state.challengesCompleted.length}/6`;
    document.getElementById('commands-run').textContent = state.commandsRun;
    
    // Update skill level
    let skillLevel = 'Beginner';
    if (state.totalPoints >= 50) skillLevel = 'Intermediate';
    if (state.totalPoints >= 100) skillLevel = 'Advanced';
    if (state.totalPoints >= 150) skillLevel = 'Expert';
    document.getElementById('skill-level').textContent = skillLevel;
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('dockerSandboxProgress');
        state.challengesCompleted = [];
        state.totalPoints = 0;
        state.commandsRun = 0;
        state.containers = [];
        state.volumes = [];
        state.currentChallenge = null;
        
        // Reset challenge cards
        document.querySelectorAll('.challenge-card').forEach(card => {
            card.classList.remove('completed');
            const btn = card.querySelector('.btn-challenge');
            if (btn) {
                btn.textContent = 'Start Challenge';
                btn.disabled = false;
            }
        });
        
        // Reset challenges object
        Object.values(challenges).forEach(c => {
            c.completed = false;
            c.currentStep = undefined;
        });
        
        updateProgressDisplay();
        addToTerminal('\nProgress has been reset.', 'success');
    }
}

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    terminalInput.focus();
    
    // Add some initial containers for demo
    addToTerminal('System initialized. Docker sandbox ready!\n', 'success');
});

// Keep focus on terminal when clicking in terminal area
document.querySelector('.terminal-body').addEventListener('click', function() {
    terminalInput.focus();
});
