const FIXED_ALIGNMENTS = {
    'bigint': 8, 'int8': 8,
    'double precision': 8, 'float8': 8,
    'timestamp': 8, 'timestamptz': 8,
    'time': 8, 'timetz': 8,
    'interval': 8, 'money': 8,
    'smallserial': 2, 'int2': 2, 'smallint': 2,
    'serial': 4, 'int4': 4, 'integer': 4, 
    'real': 4, 'float4': 4, 'date': 4,
    'boolean': 1, 'bool': 1,
    'uuid': 4, 'char': 1
};

const VARIABLE_KEYWORDS = new Set([
    'text', 'varchar', 'character varying', 
    'json', 'jsonb', 'xml', 'array', 'bytea',
    'decimal', 'numeric', 'cidr', 'inet'
]);

document.getElementById('sqlFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const original = e.target.result;
        const optimized = optimizeSchema(original);
        
        document.getElementById('originalContent').textContent = original;
        document.getElementById('optimizedContent').textContent = optimized;
    };
    
    reader.readAsText(file);
});

function optimizeSchema(sql) {
    return sql.split('\n').map(line => {
        if (!/CREATE TABLE/i.test(line)) return line;
        return processTable(line);
    }).join('\n');
}

function processTable(line) {
    const tableMatch = line.match(/(CREATE TABLE .+?)(\(.*\))/is);
    if (!tableMatch) return line;
    
    const [_, prefix, columns] = tableMatch;
    const optimizedColumns = parseColumns(columns);
    
    return `${prefix}${optimizedColumns}`;
}

function parseColumns(columns) {
    const columnStrings = columns
        .slice(1, -1) // Remove outer parentheses
        .split(',')
        .map(c => c.trim())
        .filter(c => c);
    
    const classified = columnStrings.map(c => {
        const [name, type] = c.split(/\s+/);
        const alignment = classifyType(type);
        return { original: c, alignment };
    });
    
    const sorted = classified.sort((a, b) => 
        (b.alignment || 0) - (a.alignment || 0)
    );
    
    return `(\n    ${sorted.map(c => c.original).join(',\n    ')}\n)`;
}

function classifyType(type) {
    const lowerType = type.toLowerCase();
    for (const [keyword, align] of Object.entries(FIXED_ALIGNMENTS)) {
        if (lowerType.startsWith(keyword)) return align;
    }
    return VARIABLE_KEYWORDS.has(lowerType) ? null : 0;
}

function copyToClipboard() {
    const content = document.getElementById('optimizedContent');
    navigator.clipboard.writeText(content.textContent);
    alert('Optimized schema copied to clipboard!');
}