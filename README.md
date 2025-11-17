# ✅ ToDo Web Application - v3.1

A clean and modern to-do list application built with HTML5, CSS3, and vanilla JavaScript. Add tasks, mark them as completed, and delete them with ease.

**NEW in v3.1: Dark/Light Theme Toggle, CSS Variables, Enhanced Theming, and Persistent Theme Preference!**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Persistence-blue?style=for-the-badge)
![DragDrop](https://img.shields.io/badge/Drag%20Drop-Reorder-green?style=for-the-badge)
![Theme](https://img.shields.io/badge/Theme-Dark%20&%20light-yellow?style=for-the-badge)

**Smart Editing. Beautiful Reordering. Dark & Light Themes.** 🎯

---

## 🆕 What's New in v3.1

### 🌙 **Dark/Light Theme Toggle** ⭐⭐ NEW (MAJOR)

- **Theme Toggle Button** - Top-right corner button
- **Sun/Moon SVG Icons** - Visual theme indicators
- **Light Mode** - Default light gray (#f4f7f6) background
- **Dark Mode** - Professional dark (#1a1a1a) background
- **Instant Theme Switch** - No page reload required
- **Smooth Transitions** - 0.3s ease color transitions
- **Click to Toggle** - Single click to change theme
- **Professional Icon Design** - Custom SVG sun/moon icons

### 🎨 **CSS Variables System** ⭐⭐ NEW (MAJOR)

- **Root Color Variables** - Centralized color management
- **Dynamic Color Switching** - Update via CSS variables
- **Light Mode Variables** - Complete color palette
- **Dark Mode Variables** - Full dark theme colors
- **Smooth Transitions** - All color changes animated
- **Easy Customization** - Change colors in one place
- **Scalable Design** - Easy to extend themes
- **Professional Implementation** - Industry-standard approach

### 🌈 **Enhanced Color Palette** ⭐⭐ NEW (MAJOR)

**Light Mode Colors:**

- Background: #f4f7f6 (light gray)
- Container: #ffffff (white)
- Text: rgb(75, 75, 75) (dark gray)
- Input Border: #ddd (light gray)
- Pending Border: #3498db (blue)
- Completed Border: #5cb85c (green)
- Delete Hover: #e74c3c (red)
- Dragging Background: #cceeff (light blue)

**Dark Mode Colors:**

- Background: #1a1a1a (very dark)
- Container: #2b2b2b (dark gray)
- Text: #e0e0e0 (light gray)
- Input Border: #444 (dark gray)
- Dragging Background: #00334d (dark blue)
- All other colors optimized for dark mode

### 💾 **Theme Persistence** ⭐ NEW

- **localStorage Integration** - Save theme preference
- **Auto-Load Theme** - Restore on page reload
- **Separate Storage** - Theme saved independently
- **Smart Loading** - Defaults to "light" if not set
- **Immediate Application** - Theme applied on load
- **State Management** - Integrated with app state

### 🎭 **Visual Improvements** ⭐ NEW

- **Icon Positioning** - Absolute positioning top-right
- **Hover Effects** - Color changes on hover
- **Smooth Animations** - All transitions smooth
- **Contrast** - Proper text/background contrast
- **Accessibility** - Readable in both themes
- **Professional Look** - Polish and refinement

### ✅ **Complete Feature Set** (v3.0 Features Retained)

- **Add Tasks** - Input form with validation
- **Mark Complete** - Click task to toggle completion
- **Delete Tasks** - SVG trash icon
- **Filter Tasks** - All, Active, Completed
- **Edit Inline** - Double-click to edit
- **Drag & Drop** - Reorder tasks easily
- **Empty State** - "No tasks" message
- **LocalStorage** - Persist all data

---

## 🎯 Features

### 🌙 Theme System

**Light Mode (Default):**

```css
:root {
  --bg-color: #f4f7f6;
  --container-bg: #ffffff;
  --text-color: rgb(75, 75, 75);
  --text-light: #888888;
  --text-empty: #aaa;
  --input-border: #ddd;
  --hover-bg: #f9f9f9;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --pending-border: #3498db;
  --completed-border: #5cb85c;
  --delete-hover: #e74c3c;
  --dragging-bg: #cceeff;
}
```

**Dark Mode:**

```css
body.dark-mode {
  --bg-color: #1a1a1a;
  --container-bg: #2b2b2b;
  --text-color: #e0e0e0;
  --text-light: #a0a0a0;
  --text-empty: #777;
  --input-border: #444;
  --hover-bg: #333;
  --shadow-color: rgba(0, 0, 0, 0.4);
  --dragging-bg: #00334d;
}
```

### 🔘 Toggle Button Implementation

**HTML:**

```html
<button
  class="theme-toggle"
  id="theme-toggle-btn"
  aria-label="Toggle theme"
></button>
```

**Styling:**

```css
.theme-toggle {
  position: absolute;
  top: 1em;
  right: 1em;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.theme-toggle:hover {
  color: var(--pending-border);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
}
```

### 💻 JavaScript Implementation

**State Management:**

```javascript
let state = {
  todos: [],
  filter: "all",
  theme: "light", // NEW in v3.1
};
```

**Theme Toggle:**

```javascript
themeToggleBtn.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveTheme();
  applyTheme();
});
```

**Apply Theme:**

```javascript
function applyTheme() {
  if (state.theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.innerHTML = sunIcon;
  } else {
    document.body.classList.remove("dark-mode");
    themeToggleBtn.innerHTML = moonIcon;
  }
}
```

**Save & Load:**

```javascript
function saveTheme() {
  localStorage.setItem("theme", state.theme);
}

function loadState() {
  const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
  state.todos = savedTodos;
  const savedTheme = localStorage.getItem("theme") || "light";
  state.theme = savedTheme;
}
```

### 🎨 CSS Variables in Action

**All Elements Use Variables:**

```css
body {
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.container {
  background-color: var(--container-bg);
  box-shadow: 0 4px 12px var(--shadow-color);
  transition: background-color 0.3s ease;
}

input {
  border: 1px solid var(--input-border);
  background-color: var(--bg-color);
  color: var(--text-color);
}

.todo {
  border-left: 4px solid var(--pending-border);
  color: var(--text-color);
}
```

### 📱 Icon System

**Sun Icon (Light Mode):**

```javascript
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24" viewBox="0 0 24 24" 
  fill="none" stroke-width="2">
  <!-- Sun rays animation -->
</svg>`;
```

**Moon Icon (Dark Mode):**

```javascript
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" 
  width="24" height="24" viewBox="0 0 24 24" 
  fill="none" stroke-width="2">
  <!-- Moon crescent -->
</svg>`;
```

---

## 📦 File Structure

```
todo-app-v3-1/
├── index.html       # HTML with theme toggle button
├── main.js          # Enhanced with theme management
├── style.css        # CSS variables + theme styles
└── README.md        # This documentation
```

### File Breakdown

| File           | Size   | Purpose                |
| -------------- | ------ | ---------------------- |
| **index.html** | 1.2 KB | HTML + theme button    |
| **main.js**    | 8.0 KB | All v3.0 + theme logic |
| **style.css**  | 3.9 KB | Variables + themes     |

---

## 🚀 Getting Started

### Quick Setup

1. **Download All Files**

   ```
   - index.html
   - main.js
   - style.css
   ```

2. **Keep Files Together**

   - All files in same directory
   - Maintain exact file names

3. **Open in Browser**

   ```bash
   open index.html      # macOS
   start index.html     # Windows
   xdg-open index.html  # Linux
   ```

4. **Start Managing Tasks**
   - Type task and press Enter to add
   - Click task text to mark complete
   - Double-click task to edit text
   - Press Enter or click away to save
   - Press Escape to cancel edit
   - Drag tasks to reorder them
   - Click trash icon to delete
   - **Click sun/moon button to toggle theme!**
   - Theme preference saves automatically

### Browser Requirements

- **Chrome/Edge**: 60+
- **Firefox**: 55+
- **Safari**: 10.1+
- **Opera**: 47+
- **Mobile Browsers**: All modern versions

---

## 🌙 Theme Features

### Dark Mode Benefits

**Eye Comfort:**

- Reduces eye strain in low-light environments
- Lower blue light emission
- Professional appearance

**Battery Life:**

- Mobile devices use less battery with dark backgrounds
- OLED screens benefit from dark pixels
- Energy-efficient display

**Visual Appeal:**

- Modern, trendy appearance
- Professional aesthetic
- Better contrast for text

### Light Mode Benefits

**Day Usage:**

- Better for bright environments
- Natural appearance
- Familiar to most users

**Accessibility:**

- Higher contrast ratios
- Better for users with light sensitivity
- Standard default

### Smooth Transitions

**0.3s Ease Transition:**

```css
transition: background-color 0.3s ease, color 0.3s ease;
```

**Smooth Experience:**

- Colors fade gradually
- No jarring changes
- Professional feel
- Eye-friendly

---

## 💾 LocalStorage Management

**Separate Storage Keys:**

```javascript
// Todos saved separately
localStorage.setItem("todos", JSON.stringify(state.todos));

// Theme saved separately
localStorage.setItem("theme", state.theme);
```

**Auto-Load on Startup:**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  loadState(); // Load todos + theme
  applyTheme(); // Apply saved theme
  setupEventListeners();
  render();
});
```

**Data Structure:**

```javascript
{
  "todos": "[{...}, {...}]",  // JSON array
  "theme": "dark"             // "light" or "dark"
}
```

---

## 🎯 App Initialization

### Startup Sequence

```
1. Page loads
2. DOMContentLoaded event fires
3. loadState() - restore todos + theme
4. applyTheme() - apply saved theme to DOM
5. setupEventListeners() - attach all listeners
6. render() - display initial UI with theme
7. App ready for interaction
```

### Initialization Code

```javascript
document.addEventListener("DOMContentLoaded", () => {
  loadState(); // Step 3
  applyTheme(); // Step 4
  setupEventListeners(); // Step 5
  render(); // Step 6
});
```

---

## 🎨 CSS Variable Organization

### Variable Categories

**Colors:**

- `--bg-color` - Page background
- `--container-bg` - Todo container
- `--text-color` - Main text
- `--text-light` - Secondary text
- `--text-empty` - Empty state text

**Borders & Effects:**

- `--input-border` - Input field border
- `--hover-bg` - Hover background
- `--shadow-color` - Box shadows
- `--pending-border` - Pending todo border
- `--completed-border` - Completed todo border
- `--delete-hover` - Delete button hover
- `--dragging-bg` - Dragging visual

---

## 🤝 Version Comparison

| Feature               | v3.0 | v3.1 |
| --------------------- | ---- | ---- |
| **Add Tasks**         | ✅   | ✅   |
| **Mark Complete**     | ✅   | ✅   |
| **Delete Tasks**      | ✅   | ✅   |
| **Filter Tasks**      | ✅   | ✅   |
| **Edit Inline**       | ✅   | ✅   |
| **Drag & Drop**       | ✅   | ✅   |
| **Empty State**       | ✅   | ✅   |
| **LocalStorage**      | ✅   | ✅   |
| **🌙 Dark Mode**      | ❌   | ✅   |
| **CSS Variables**     | ❌   | ✅   |
| **Theme Toggle**      | ❌   | ✅   |
| **Theme Persistence** | ❌   | ✅   |
| **Sun/Moon Icons**    | ❌   | ✅   |

---

## 🎉 Browser Compatibility

| Browser           | Version | Status          |
| ----------------- | ------- | --------------- |
| **Chrome**        | 60+     | ✅ Full Support |
| **Firefox**       | 55+     | ✅ Full Support |
| **Safari**        | 10.1+   | ✅ Full Support |
| **Edge**          | 79+     | ✅ Full Support |
| **Mobile Safari** | 10.3+   | ✅ Full Support |
| **Chrome Mobile** | 60+     | ✅ Full Support |

---

## 📚 Technical Stack

- **Markup**: HTML5 (semantic, accessible)
- **Styling**: CSS3 (variables, transitions, flexbox)
- **Logic**: Vanilla JavaScript (state-based)
- **Storage**: LocalStorage API (persistent)
- **Fonts**: Google Fonts (Roboto)
- **Icons**: SVG (scalable)
- **Theming**: CSS custom properties

---

## 💬 Tips & Tricks

### For Best Experience

- Try both light and dark modes
- Toggle theme while viewing tasks
- Notice smooth color transitions
- Check icon changes with theme
- Dark mode reduces eye strain
- Light mode for bright environments

### Productivity Tips

- Use dark mode in low-light (evening/night)
- Use light mode in bright environments
- Theme preference persists across sessions
- Toggle anytime without losing data
- Experiment with your preference

### Development Tips

- Edit CSS variables to customize colors
- Add more color variables as needed
- Extend to 3+ theme options
- Create seasonal themes
- Modify transitions for different effects

---

## 🚨 Troubleshooting

### Theme Not Saving

- Check localStorage is enabled
- Verify theme key in DevTools
- Test in non-private/incognito mode
- Clear cache and reload

### Theme Not Applying

- Check body class toggle
- Verify CSS variables defined
- Test in different browser
- Check for CSS conflicts

### Icons Not Showing

- Verify SVG syntax is correct
- Check `stroke` property
- Test SVG inline vs external
- Verify `fill="none"` attribute

### Transitions Not Smooth

- Check transition duration
- Verify ease timing function
- Test in different browser
- Check GPU acceleration enabled

---

## 🎯 Future Enhancements

**Possible Features:**

- Multiple theme options (blue, green, purple, etc.)
- Scheduled themes (auto dark at sunset)
- Theme customization UI
- Export theme settings
- Community themes
- Accessibility theme (high contrast)
- Seasonal themes

**Architecture Ready For:**

- Theme switching library
- Advanced state management
- More complex theming logic
- User preferences panel
- Theme marketplace
- Real-time sync across devices

---

## 📄 License

**Educational Project - Free to Use**

- ✅ Personal use
- ✅ Educational purposes
- ✅ Learning projects
- ✅ Portfolio projects
- ✅ Modification allowed
- ✅ Sharing encouraged

---

**Organize Your Tasks, Simplify Your Life** ✅

_Beautiful task management with light and dark themes!_
