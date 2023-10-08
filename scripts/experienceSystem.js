class User {
    constructor() {
        this.xp = 0;
        this.level = 1;
    }

    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        let nextLevelThreshold = this.getThresholdForNextLevel();
        while (this.xp >= nextLevelThreshold) { 
            this.level++;
            this.xp -= nextLevelThreshold; // subtract the threshold of the just surpassed level
            nextLevelThreshold = this.getThresholdForNextLevel(); // get the threshold for the new level for the next iteration (if needed)
            alert('You leveled up to Level ' + this.level);
        }
    }
    
    getThresholdForNextLevel() {
        return this.level * 100;
    }
}

const user = new User();

document.getElementById("earnXPBtn").addEventListener("click", function() {
    user.addXP(20); 
    updateXpDisplay();
});

function updateXpDisplay() {
    document.getElementById("userXP").innerText = user.xp;
    document.getElementById("userLevel").innerText = user.level;
    const xpToNextLevel = user.getThresholdForNextLevel();
    document.getElementById("xpToNextLevel").innerText = xpToNextLevel; // Update the max XP for the next level
    const fillPercentage = (user.xp / xpToNextLevel) * 100;
    document.getElementById("xpFill").style.width = `${fillPercentage}%`;
}

// Initialization function to sync everything when the page loads
function initializeExperienceSystem() {
    updateXpDisplay();
}

document.addEventListener("DOMContentLoaded", function() {
    initializeExperienceSystem();
});
