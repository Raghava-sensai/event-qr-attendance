const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[#FFFDF9]': 'bg-[#F9F8FF]',
  'bg-[#FFE5D9]': 'bg-[#EBE0F8]',
  'hover:bg-[#FFD1C1]': 'hover:bg-[#E0D0F5]',
  'bg-[#FFD1C1]': 'bg-[#E5C1FA]',
  'hover:bg-[#FFB7B2]': 'hover:bg-[#E5B5F5]',
  'text-[#D49A89]': 'text-[#9D63D0]',
  'hover:text-[#D49A89]': 'hover:text-[#9D63D0]',
  'hover:text-[#B58273]': 'hover:text-[#8B52BD]',
  'text-[#7A6A64]': 'text-[#3B2D4A]',
  'text-[#A39189]': 'text-[#827893]',
  'border-[#F2E8DF]': 'border-[#EBE0F8]',
  'ring-[#F2E8DF]': 'ring-[#EBE0F8]',
  'focus:ring-[#FFD1C1]': 'focus:ring-[#E5C1FA]',
  'bg-[#FFDAC1]': 'bg-[#C7B9F1]',
  'stroke="#F2E8DF"': 'stroke="#EBE0F8"',
  'stroke="#FFD1C1"': 'stroke="#E5C1FA"',
  'bg-[#FFF9F5]': 'bg-[#F5F4F8]',
  'hover:bg-[#F2E8DF]': 'hover:bg-[#EAE8F0]',
  'bg-[#E2F0CB]': 'bg-[#D1F2D1]',
  'text-[#71965A]': 'text-[#2E7D32]',
  'selection:bg-[#FFE5D9]': 'selection:bg-[#EBE0F8]',
  'selection:text-[#D49A89]': 'selection:text-[#9D63D0]'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = [path.join(__dirname, 'app'), path.join(__dirname, 'components')];

targetDirs.forEach(dir => {
  walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      for (const [key, value] of Object.entries(replacements)) {
        content = content.split(key).join(value);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
      }
    }
  });
});
