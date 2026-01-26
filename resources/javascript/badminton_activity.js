 // 分数和游戏状态变量
        let score1 = 0;
        let score2 = 0;
        let gameEnded = false;
        let servingTeam = 1; // 当前发球方
        
        // 新增局數相關變量
        let totalGames = 1; // 總局數
        let currentGame = 1; // 當前局數
        let team1Wins = 0; // 隊伍1勝場數
        let team2Wins = 0; // 隊伍2勝場數
        
        // DOM元素
        const scoreEl1 = document.getElementById('score1');
        const scoreEl2 = document.getElementById('score2');
        const gameStatusEl = document.getElementById('gameStatus');
        const rulesPanel = document.getElementById('rulesPanel');
        const orientationWarning = document.getElementById('orientationWarning');
        const team1El = document.getElementById('team1');
        const team2El = document.getElementById('team2');
        const gamesCountEl = document.getElementById('gamesCount');
        const team1WinsEl = document.getElementById('team1Wins');
        const team2WinsEl = document.getElementById('team2Wins');
        const teamNameModal = document.getElementById('teamNameModal');
        const newTeamNameInput = document.getElementById('newTeamName');
        
        // 編輯隊伍名稱相關變量
        let editingTeam = 1; // 當前正在編輯的隊伍
        
        // 检查是否横屏
        function checkOrientation() {
            if (window.innerHeight > window.innerWidth) {
                orientationWarning.classList.add('active');
            } else {
                orientationWarning.classList.remove('active');
            }
        }
        
        // 初始检查
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        
        // 加分函数（点击大区域）
        function addPoint(team) {
            if (gameEnded) return;
            
            // 添加点击效果
            const teamEl = team === 1 ? team1El : team2El;
            teamEl.classList.add('clicked');
            setTimeout(() => {
                teamEl.classList.remove('clicked');
            }, 300);
            
            // 显示加分动画
            showScoreChange(team, '+1');
            
            // 更新分数
            if (team === 1) {
                score1++;
                scoreEl1.textContent = score1;
            } else {
                score2++;
                scoreEl2.textContent = score2;
            }
            
            checkGameStatus();
        }
        
        // 减分函数（点击小按钮）
        function minusPoint(team, event) {
            if (gameEnded) return;
            
            // 阻止事件冒泡，避免触发大区域的加分
            event.stopPropagation();
            
            // 显示减分动画
            showScoreChange(team, '-1');
            
            // 更新分数
            if (team === 1 && score1 > 0) {
                score1--;
                scoreEl1.textContent = score1;
            } else if (team === 2 && score2 > 0) {
                score2--;
                scoreEl2.textContent = score2;
            }
            
            checkGameStatus();
        }
        
        // 显示分数变化动画
        function showScoreChange(team, change) {
            const teamEl = team === 1 ? team1El : team2El;
            const scoreChangeEl = document.createElement('div');
            scoreChangeEl.className = 'score-change';
            scoreChangeEl.textContent = change;
            
            // 设置位置
            const rect = teamEl.getBoundingClientRect();
            scoreChangeEl.style.left = `${rect.width / 2}px`;
            scoreChangeEl.style.top = `${rect.height / 2}px`;
            
            teamEl.appendChild(scoreChangeEl);
            
            // 动画
            setTimeout(() => {
                scoreChangeEl.style.transition = 'all 0.8s ease';
                scoreChangeEl.style.opacity = '1';
                scoreChangeEl.style.transform = `translateY(-${rect.height/4}px)`;
                
                setTimeout(() => {
                    scoreChangeEl.style.opacity = '0';
                    scoreChangeEl.style.transform = `translateY(-${rect.height/2}px)`;
                    
                    setTimeout(() => {
                        if (scoreChangeEl.parentNode) {
                            scoreChangeEl.parentNode.removeChild(scoreChangeEl);
                        }
                    }, 800);
                }, 500);
            }, 10);
        }
        
        // 检查游戏状态
        function checkGameStatus() {
            // 移除之前的获胜状态
            scoreEl1.classList.remove('winner');
            scoreEl2.classList.remove('winner');
            
            // 检查比赛是否结束（根据羽毛球规则）
            let winner = null;
            
            // 检查是否达到21分且领先2分
            if (score1 >= 21 && score1 - score2 >= 2) {
                winner = 1;
            } else if (score2 >= 21 && score2 - score1 >= 2) {
                winner = 2;
            }
            
            // 检查是否达到30分（29平后）
            if (score1 >= 30) winner = 1;
            if (score2 >= 30) winner = 2;
            
            if (winner) {
                // 更新勝場數
                if (winner === 1) {
                    team1Wins++;
                } else {
                    team2Wins++;
                }
                
                // 更新勝場顯示
                updateWinsDisplay();
                
                // 檢查是否贏得整個比賽
                const neededWins = Math.ceil(totalGames / 2);
                
                if (team1Wins >= neededWins || team2Wins >= neededWins) {
                    // 整個比賽結束
                    gameEnded = true;
                    const matchWinner = team1Wins >= neededWins ? 1 : 2;
                    
                    if (matchWinner === 1) {
                        scoreEl1.classList.add('winner');
                        showGameStatus(`比賽結束！隊伍 1 以 ${team1Wins}:${team2Wins} 獲勝！`);
                    } else {
                        scoreEl2.classList.add('winner');
                        showGameStatus(`比賽結束！隊伍 2 以 ${team2Wins}:${team1Wins} 獲勝！`);
                    }
                    
                    // 禁用点击事件
                    team1El.style.pointerEvents = 'none';
                    team2El.style.pointerEvents = 'none';
                    document.querySelectorAll('.minus-btn').forEach(btn => {
                        btn.style.pointerEvents = 'none';
                        btn.style.opacity = '0.5';
                    });
                } else {
                    // 單局結束，但整個比賽還沒結束
                    currentGame++;
                    showGameStatus(`第 ${currentGame-1} 局結束，隊伍 ${winner} 獲勝！準備第 ${currentGame} 局`);
                    
                    // 延遲重置分數，開始下一局
                    setTimeout(() => {
                        resetScoreForNextGame();
                    }, 3000);
                }
            } else {
                // 更新发球方（简单逻辑：总分是偶数时队伍1发球，奇数时队伍2发球）
                const totalPoints = score1 + score2;
                servingTeam = totalPoints % 2 === 0 ? 1 : 2;
                showGameStatus(`第 ${currentGame} 局 | 發球方：隊伍 ${servingTeam}`);
            }
        }
        
        // 更新勝場顯示
        function updateWinsDisplay() {
            team1WinsEl.innerHTML = `${document.getElementById('teamName1').textContent}: <span>${team1Wins}</span> 勝`;
            team2WinsEl.innerHTML = `${document.getElementById('teamName2').textContent}: <span>${team2Wins}</span> 勝`;
        }
        
        // 為下一局重置分數
        function resetScoreForNextGame() {
            score1 = 0;
            score2 = 0;
            scoreEl1.textContent = '0';
            scoreEl2.textContent = '0';
            
            // 移除获胜状态
            scoreEl1.classList.remove('winner');
            scoreEl2.classList.remove('winner');
            
            // 更新遊戲狀態
            showGameStatus(`第 ${currentGame} 局開始`);
        }
        
        // 显示游戏状态
        function showGameStatus(message) {
            gameStatusEl.textContent = message;
            gameStatusEl.classList.add('active');
            
            // 3秒后隐藏状态（如果不是获胜状态）
            if (!gameEnded) {
                setTimeout(() => {
                    gameStatusEl.classList.remove('active');
                }, 3000);
            }
        }
        
        // 重置分数（全部重置）
        function resetScore() {
            score1 = 0;
            score2 = 0;
            currentGame = 1;
            team1Wins = 0;
            team2Wins = 0;
            gameEnded = false;
            servingTeam = 1;
            
            scoreEl1.textContent = '0';
            scoreEl2.textContent = '0';
            
            // 移除获胜状态
            scoreEl1.classList.remove('winner');
            scoreEl2.classList.remove('winner');
            
            // 更新勝場顯示
            updateWinsDisplay();
            
            // 启用点击事件
            team1El.style.pointerEvents = 'auto';
            team2El.style.pointerEvents = 'auto';
            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            });
            
            showGameStatus('比賽已重置');
        }
        
        // 交换队伍
        function swapTeams() {
            // 交换分数
            const tempScore = score1;
            score1 = score2;
            score2 = tempScore;
            
            scoreEl1.textContent = score1;
            scoreEl2.textContent = score2;
            
            // 交换胜场
            const tempWins = team1Wins;
            team1Wins = team2Wins;
            team2Wins = tempWins;
            
            // 更新勝場顯示
            updateWinsDisplay();
            
            // 交换队伍名称
            const teamName1 = document.getElementById('teamName1').textContent;
            const teamName2 = document.getElementById('teamName2').textContent;
            document.getElementById('teamName1').textContent = teamName2;
            document.getElementById('teamName2').textContent = teamName1;
            
            // 交换背景颜色
            const team1 = document.querySelector('.team1');
            const team2 = document.querySelector('.team2');
            
            const tempBg = getComputedStyle(team1).background;
            team1.style.background = getComputedStyle(team2).background;
            team2.style.background = tempBg;
            
            showGameStatus('隊伍已交換');
        }
        
        // 结束游戏
        function endGame() {
            if (score1 === score2) {
                showGameStatus('比賽平局！');
            } else if (score1 > score2) {
                gameEnded = true;
                scoreEl1.classList.add('winner');
                showGameStatus('比賽結束！隊伍 1 獲勝！');
            } else {
                gameEnded = true;
                scoreEl2.classList.add('winner');
                showGameStatus('比賽結束！隊伍 2 獲勝！');
            }
            
            // 禁用点击事件
            team1El.style.pointerEvents = 'none';
            team2El.style.pointerEvents = 'none';
            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            });
        }
        
        // 切换规则显示
        function toggleRules() {
            rulesPanel.classList.toggle('active');
        }
        
        // 修改局數
        function changeGames(val) {
            if (gameEnded) return;
            
            totalGames = Math.max(1, Math.min(7, totalGames + val)); // 限制在1-7局之間
            gamesCountEl.textContent = totalGames;
            
            // 重置勝場數如果新局數小於已獲勝場數
            const neededWins = Math.ceil(totalGames / 2);
            if (team1Wins >= neededWins || team2Wins >= neededWins) {
                team1Wins = 0;
                team2Wins = 0;
                currentGame = 1;
                updateWinsDisplay();
                resetScoreForNextGame();
            }
            
            showGameStatus(`比賽設置為 ${totalGames} 局 ${Math.ceil(totalGames/2)} 勝制`);
        }
        
        // 編輯隊伍名稱
        function editTeamName(team, event) {
            event.stopPropagation(); // 防止觸發加分
            editingTeam = team;
            
            // 設置當前隊伍名稱到輸入框
            const currentName = document.getElementById(`teamName${team}`).textContent;
            newTeamNameInput.value = currentName;
            
            // 顯示彈窗
            teamNameModal.classList.add('active');
            newTeamNameInput.focus();
        }
        
        // 確認修改隊伍名稱
        function confirmTeamName() {
            const newName = newTeamNameInput.value.trim();
            if (newName) {
                document.getElementById(`teamName${editingTeam}`).textContent = newName;
                
                // 更新勝場顯示中的隊伍名稱
                updateWinsDisplay();
                
                showGameStatus(`隊伍 ${editingTeam} 名稱已修改為 ${newName}`);
            }
            
            // 關閉彈窗
            teamNameModal.classList.remove('active');
            newTeamNameInput.value = '';
        }
        
        // 取消修改隊伍名稱
        function cancelTeamName() {
            teamNameModal.classList.remove('active');
            newTeamNameInput.value = '';
        }
        
        // 初始检查游戏状态
        checkGameStatus();