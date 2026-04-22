# Docker Sandbox - Learn & Practice Docker

An interactive web-based learning environment for mastering Docker through hands-on practice, challenges, and real-time terminal simulation.

![Docker](https://img.shields.io/badge/Docker-Learning-blue?style=for-the-badge&logo=docker)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Modern-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Flexbox%20%26%20Grid-red?style=for-the-badge&logo=css3)

## 🌟 Features

- **Interactive Terminal Simulation** - Practice Docker commands in a realistic terminal environment
- **Learn Section** - Comprehensive tutorials covering Docker fundamentals:
  - Basics
  - Images
  - Containers
  - Networking
  - Volumes
  - Dockerfile
- **Practice Mode** - Hands-on exercises with guided tasks
- **Challenges** - Test your skills with progressively difficult Docker challenges
- **Progress Tracking** - Your learning progress is saved locally
- **Reference Guide** - Quick access to common Docker commands and syntax
- **Responsive Design** - Works on desktop and mobile devices

## 📁 Project Structure

```
docker-sandbox/
├── index.html      # Main HTML structure and content
├── styles.css      # Styling and responsive design
├── script.js       # Interactive functionality and terminal simulation
├── .gitignore      # Git ignore rules
└── README.md       # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server required - runs entirely in the browser!

### Installation

1. Clone or download this repository:
   ```bash
   git clone <repository-url>
   cd docker-sandbox
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Use a local server (optional):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. Navigate to `http://localhost:8000` (if using a local server)

## 📖 Usage

### Navigation

- **Learn** - Study Docker fundamentals through interactive lessons
- **Practice** - Get hands-on experience with guided exercises
- **Challenges** - Test your knowledge with Docker challenges
- **Reference** - Quick lookup for Docker commands

### Terminal Commands

The simulated terminal supports various Docker commands including:

```bash
# Help
help

# Container management
docker ps
docker run <image>
docker stop <container>
docker rm <container>

# Image management
docker images
docker pull <image>
docker rmi <image>

# System information
docker info
docker version

# Clear terminal
clear
```

## 🎯 Learning Paths

### Beginner
1. Start with the **Basics** tab in the Learn section
2. Understand what Docker is and why it's useful
3. Learn about images and containers
4. Practice basic commands in the terminal

### Intermediate
1. Explore **Networking** and **Volumes**
2. Learn how containers communicate
3. Understand data persistence
4. Complete practice exercises

### Advanced
1. Master **Dockerfile** creation
2. Build custom images
3. Take on challenging scenarios
4. Test your skills with challenges

## 💡 Features Detail

### Progress Tracking
Your progress is automatically saved in the browser's localStorage:
- Commands run count
- Challenges completed
- Total points earned

### Challenge System
- Earn points by completing challenges
- Track your completed challenges
- Progressive difficulty levels

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality and state management
- **Google Fonts** - Fira Code and Inter fonts for optimal readability
- **LocalStorage API** - Persistent progress tracking

## 🎨 Design Features

- Clean, modern interface inspired by Docker's branding
- Responsive design for all screen sizes
- Syntax-highlighted terminal output
- Smooth animations and transitions
- Accessible color scheme

## 📝 Customization

You can customize the sandbox by modifying:

- `styles.css` - Change colors, layouts, and themes
- `script.js` - Add new commands, challenges, or features
- `index.html` - Modify content structure and sections

## 🔧 Development

### Adding New Commands

Edit `script.js` and add your command handler in the `executeCommand` function:

```javascript
} else if (cmd === 'your-command') {
    // Your command logic here
}
```

### Adding New Challenges

Add challenge objects to the challenges array in `script.js`:

```javascript
{
    id: 'new-challenge',
    title: 'Challenge Title',
    description: 'Description of the task',
    hint: 'Optional hint',
    solution: 'Expected solution',
    points: 100
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Docker team for the amazing containerization platform
- Google Fonts for beautiful typography
- The open-source community for inspiration

## 📞 Support

For questions or issues:
- Check the Reference section for command documentation
- Review the Learn section for tutorials
- Use the Help command in the terminal

---

**Happy Dockering! 🐳**

Start your Docker journey today by opening `index.html` in your browser!
