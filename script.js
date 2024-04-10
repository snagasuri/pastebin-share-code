window.onload = async () => {
    const runCodeBtn = document.getElementById('runCode');
    const saveCodeBtn = document.getElementById('saveCode');
    const fetchCodeBtn = document.getElementById('fetchCode');
    const output = document.getElementById('output');
    const fetchCodeIdInput = document.getElementById('fetchCodeId');

    // Initialize Pyodide
    let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/"
    });

    // Initialize Ace Editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");

    // Run Python code in the browser
    // Run Python code in the browser
// Run Python code in the browser
runCodeBtn.addEventListener('click', async () => {
    output.textContent = ''; // Clear previous output
    try {
        let code = editor.getValue();
        
        // Redirect the output
        pyodide.stdout = (text) => { output.textContent += text; };
        pyodide.stderr = (text) => { output.textContent += text; };

        await pyodide.runPythonAsync(code);
        output.textContent = pyodide.stdout
        // If there was no output, say 'No output'
        // if (output.textContent.trim() === '') {
        //     output.textContent = 'No output';
        // }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    } finally {
        // Reset stdout and stderr
        pyodide.stdout = console.log;
        pyodide.stderr = console.error;
    }
});



    // Save code to the backend
    saveCodeBtn.addEventListener('click', async () => {
        let code = editor.getValue();
        let response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });
        let data = await response.json();
        if (data.id) {
            let shareableLink = `http://localhost:3000/snippet/${data.id}`;
            output.innerHTML = `Code saved. Shareable link: <a href="${shareableLink}" target="_blank">${shareableLink}</a>`;
        } else {
            output.textContent = `Error: ${data.message}`;
        }
    });

    // Fetch code by ID from the backend
    fetchCodeBtn.addEventListener('click', async () => {
        let id = fetchCodeIdInput.value;
        let response = await fetch(`http://localhost:3000/snippet/${id}`);
        let data = await response.json();
        if (data.code) {
            editor.setValue(data.code, -1); // -1 prevents selecting all text after setting new value
        } else {
            output.textContent = `Error: ${data.message}`;
        }
    });
};
