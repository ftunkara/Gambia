// Comment functionality with local storage
function addcomment() {
    const commentInput = document.getElementById('commentInput');
    const nameInput = document.getElementById('nameInput');
    const commentList = document.getElementById('commentList');
    
    // Get the values from the input fields
    const commentText = commentInput.value.trim();
    const name = nameInput.value.trim();
    
    // Check if both fields are filled
    if (commentText === '' || name === '') {
        alert('Please fill in both name and comment fields!');
        return;
    }
    
    // Create comment object
    const comment = {
        name: name,
        text: commentText,
        timestamp: new Date().toLocaleString(),
        id: Date.now() // Unique ID for each comment
    };
    
    // Save comment to local storage
    saveComment(comment);
    
    // Add comment to the list
    addCommentToList(comment);
    
    // Clear the input fields
    commentInput.value = '';
    nameInput.value = '';
    
    // Focus back to the comment input
    commentInput.focus();
}

// Save comment to local storage
function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem('gambiaComments') || '[]');
    comments.push(comment);
    localStorage.setItem('gambiaComments', JSON.stringify(comments));
}

// Load comments from local storage
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('gambiaComments') || '[]');
    const commentList = document.getElementById('commentList');
    
    // Clear existing comments
    commentList.innerHTML = '';
    
    // Add each comment to the list
    comments.forEach(comment => {
        addCommentToList(comment);
    });
}

// Add comment to the DOM
function addCommentToList(comment) {
    const commentList = document.getElementById('commentList');
    
    // Create a new comment item
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.dataset.commentId = comment.id;
    
    // Create the comment content
    listItem.innerHTML = `
        <div class="comment-author">${comment.name}</div>
        <div class="comment-text">${comment.text}</div>
        <small class="text-muted">${comment.timestamp}</small>
        <button class="btn btn-sm btn-outline-danger float-end" onclick="deleteComment(${comment.id})">Delete</button>
    `;
    
    // Add the comment to the list
    commentList.appendChild(listItem);
}

// Delete comment function
function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        // Remove from local storage
        let comments = JSON.parse(localStorage.getItem('gambiaComments') || '[]');
        comments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem('gambiaComments', JSON.stringify(comments));
        
        // Remove from DOM
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentElement) {
            commentElement.remove();
        }
    }
}

// Clear all comments function
function clearAllComments() {
    if (confirm('Are you sure you want to delete all comments? This cannot be undone.')) {
        localStorage.removeItem('gambiaComments');
        const commentList = document.getElementById('commentList');
        commentList.innerHTML = '';
    }
}

// Country API functionality
async function fetchGambiaData() {
    try {
        const response = await fetch('http://countryapi.gear.host/v1/Country/getCountries');
        const countries = await response.json();
        
        // Find The Gambia in the countries array
        const gambia = countries.find(country => 
            country.name === 'Gambia' || 
            country.name === 'The Gambia' || 
            country.alpha2Code === 'GM'
        );
        
        if (gambia) {
            displayGambiaInfo(gambia);
        } else {
            displayFallbackGambiaInfo();
        }
    } catch (error) {
        console.error('Error fetching country data:', error);
        // Display fallback info if API fails
        displayFallbackGambiaInfo();
    }
}

function displayGambiaInfo(gambia) {
    // Get the country info placeholder
    const countryInfo = document.getElementById('country-info');
    countryInfo.className = 'country-info mt-4 p-4 bg-white rounded shadow';
    countryInfo.innerHTML = `
        <h2 class="text-center mb-3">🇬🇲 ${gambia.name}</h2>
        <div class="row">
            <div class="col-md-6">
                <h4>Quick Facts</h4>
                <ul class="list-unstyled">
                    <li><strong>Capital:</strong> ${gambia.capital || 'Banjul'}</li>
                    <li><strong>Region:</strong> ${gambia.region || 'Africa'}</li>
                    <li><strong>Population:</strong> ${gambia.population ? gambia.population.toLocaleString() : '~2.4 million'}</li>
                    <li><strong>Area:</strong> ${gambia.area ? `${gambia.area.toLocaleString()} km²` : '11,295 km²'}</li>
                    <li><strong>Currency:</strong> ${gambia.currencies ? gambia.currencies.map(c => c.name).join(', ') : 'Gambian Dalasi'}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h4>Languages</h4>
                <p>${gambia.languages ? gambia.languages.map(lang => lang.name).join(', ') : 'English, Mandinka, Wolof, Fula'}</p>
                
                <h4>Time Zones</h4>
                <p>${gambia.timezones ? gambia.timezones.join(', ') : 'UTC+0'}</p>
            </div>
        </div>
    `;
}

function displayFallbackGambiaInfo() {
    // Get the country info placeholder
    const countryInfo = document.getElementById('country-info');
    countryInfo.className = 'country-info mt-4 p-4 bg-white rounded shadow';
    countryInfo.innerHTML = `
        <h2 class="text-center mb-3">🇬🇲 The Gambia</h2>
        <div class="row">
            <div class="col-md-6">
                <h4>Quick Facts</h4>
                <ul class="list-unstyled">
                    <li><strong>Capital:</strong> Banjul</li>
                    <li><strong>Region:</strong> West Africa</li>
                    <li><strong>Population:</strong> ~2.4 million</li>
                    <li><strong>Area:</strong> 11,295 km²</li>
                    <li><strong>Currency:</strong> Gambian Dalasi (GMD)</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h4>Languages</h4>
                <p>English (Official), Mandinka, Wolof, Fula, Soninke</p>
                
                <h4>Time Zones</h4>
                <p>UTC+0 (GMT)</p>
                
                <h4>Independence</h4>
                <p>February 18, 1965 (from United Kingdom)</p>
            </div>
        </div>
        <div class="text-center mt-3">
            <small class="text-muted">Data source: Country information</small>
        </div>
    `;
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        alert('Please enter a search term');
        return;
    }
    
    // Define search terms and their corresponding pages
    const searchData = {
        'banjul': 'banjul.html',
        'capital': 'banjul.html',
        'serrekunda': 'serrekunda.html',
        'market': 'serrekunda.html',
        'allunhare': 'allunhare.html',
        'village': 'allunhare.html',
        'culture': 'culture.html',
        'wedding': 'culture.html',
        'clothing': 'culture.html',
        'masquerade': 'culture.html',
        'tribes': 'people.html',
        'mandinka': 'people.html',
        'fula': 'people.html',
        'wolof': 'people.html',
        'jola': 'people.html',
        'food': 'food.html',
        'cuisine': 'food.html',
        'fun facts': 'funfacts.html',
        'facts': 'funfacts.html',
        'gambia': 'about.html',
        'about': 'about.html',
        'fatoumata': 'contact.html',
        'about me': 'contact.html',
        'home': 'index.html',
        'gambian': 'index.html'
    };
    
    // Check if search term matches any defined terms
    for (const [term, page] of Object.entries(searchData)) {
        if (searchTerm.includes(term) || term.includes(searchTerm)) {
            window.location.href = page;
            return;
        }
    }
    
    // If no exact match, show suggestions
    const suggestions = Object.keys(searchData).filter(term => 
        term.includes(searchTerm) || searchTerm.includes(term)
    );
    
    if (suggestions.length > 0) {
        alert(`Did you mean: ${suggestions.join(', ')}?`);
    } else {
        alert('No results found. Try searching for: banjul, culture, food, people, fun facts, or about me');
    }
}

// Add event listener for Enter key in comment input
document.addEventListener('DOMContentLoaded', function() {
    const commentInput = document.getElementById('commentInput');
    const nameInput = document.getElementById('nameInput');
    
    // Allow submitting with Enter key in comment field
    commentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addcomment();
        }
    });
    
    // Allow submitting with Enter key in name field
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addcomment();
        }
    });
    
    // Fetch Gambia data when page loads
    fetchGambiaData();
    // Load comments when page loads
    loadComments();

    // Add event listener for search form
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    // Add event listener for search button
    const searchButton = document.querySelector('button[type="submit"]');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
});
