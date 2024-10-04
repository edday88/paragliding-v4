const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const PARAGLIDER_SIZE = 20;
const TREE_WIDTH = 40;
const THERMAL_WIDTH = 30;
const GRAVITY = 0.1;
const THERMAL_STRENGTH = 0.4;
const PARAGLIDER_SPEED = 5;

// Paraglider Object
const paraglider = {
    x: SCREEN_WIDTH / 2,
    y: SCREEN_HEIGHT / 2,
    velocityY: 0,
    update: function () {
        // Apply gravity
        this.velocityY += GRAVITY;
        this.y += this.velocityY;

        // Move left or right with keys
        if (keys.left) {
            this.x -= PARAGLIDER_SPEED;
        }
        if (keys.right) {
            this.x += PARAGLIDER_SPEED;
        }

        // Keep paraglider within screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x > SCREEN_WIDTH - PARAGLIDER_SIZE) this.x = SCREEN_WIDTH - PARAGLIDER_SIZE;
        if (this.y < 0) this.y = 0;
        if (this.y > SCREEN_HEIGHT - PARAGLIDER_SIZE) this.y = SCREEN_HEIGHT - PARAGLIDER_SIZE;
    },
    draw: function () {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, PARAGLIDER_SIZE, PARAGLIDER_SIZE);
    }
};

// Tree Class
class Tree {
    constructor(x, height) {
        this.x = x;
        this.height = height;
    }

    update() {
        this.x -= 3;
        if (this.x < -TREE_WIDTH) {
            this.x = SCREEN_WIDTH;
            this.height = Math.floor(Math.random() * 200) + 100;
        }
    }

    draw() {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, SCREEN_HEIGHT - this.height, TREE_WIDTH, this.height);
    }
}

// Thermal Class
class Thermal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.x -= 3;
        if (this.x < -THERMAL_WIDTH) {
            this.x = SCREEN_WIDTH;
            this.y = Math.floor(Math.random() * (SCREEN_HEIGHT - 100)) + 50;
        }
    }

    draw() {
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(this.x, this.y, THERMAL_WIDTH, THERMAL_WIDTH);
    }
}

// Initialize Trees and Thermals
const trees = Array.from({ length: 5 }, () => new Tree(Math.floor(Math.random() * 400) + 400, Math.floor(Math.random() * 200) + 100));
const thermals = Array.from({ length: 3 }, () => new Thermal(Math.floor(Math.random() * 400) + 400, Math.floor(Math.random() * (SCREEN_HEIGHT - 100)) + 50));

// Key Handling
const keys = { left: false, right: false };
window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});
window.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// Main Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Update and draw game objects
    paraglider.update();
    paraglider.draw();

    trees.forEach(tree => {
        tree.update();
        tree.draw();
        // Check for collision with tree
        if (paraglider.x < tree.x + TREE_WIDTH &&
            paraglider.x + PARAGLIDER_SIZE > tree.x &&
            paraglider.y + PARAGLIDER_SIZE > SCREEN_HEIGHT - tree.height) {
            alert("Game Over!");
            document.location.reload();
        }
    });

    thermals.forEach(thermal => {
        thermal.update();
        thermal.draw();
        // Check for collision with thermal
        if (paraglider.x < thermal.x + THERMAL_WIDTH &&
            paraglider.x + PARAGLIDER_SIZE > thermal.x &&
            paraglider.y < thermal.y + THERMAL_WIDTH &&
            paraglider.y + PARAGLIDER_SIZE > thermal.y) {
            paraglider.velocityY -= THERMAL_STRENGTH;
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
