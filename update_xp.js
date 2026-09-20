const fs = require('fs');

// Update app/actions/events.ts
let actions = fs.readFileSync('app/actions/events.ts', 'utf8');
actions = actions.replace(
  /const stage_label = formData.get\('stage_label'\) as string/g,
  "const stage_label = formData.get('stage_label') as string\n  const xp_value = parseInt(formData.get('xp_value') as string) || 1"
);
actions = actions.replace(
  /tags,/g,
  "tags,\n      xp_value,"
);
fs.writeFileSync('app/actions/events.ts', actions);

// Update new/page.tsx
let newPage = fs.readFileSync('app/admin/events/new/page.tsx', 'utf8');
if (!newPage.includes('xp_value')) {
  newPage = newPage.replace(
    /<div>\s*<label htmlFor="category"[\s\S]*?<\/div>\s*<\/div>/,
    match => match + `\n\n            <div>
              <label htmlFor="xp_value" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                XP Value (Aura Points)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="xp_value"
                  id="xp_value"
                  defaultValue="5"
                  className="block w-full rounded-2xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                />
              </div>
            </div>`
  );
  fs.writeFileSync('app/admin/events/new/page.tsx', newPage);
}

// Update edit/page.tsx
let editPage = fs.readFileSync('app/admin/events/[id]/edit/page.tsx', 'utf8');
if (!editPage.includes('xp_value')) {
  editPage = editPage.replace(
    /<div>\s*<label htmlFor="category"[\s\S]*?<\/div>\s*<\/div>/,
    match => match + `\n\n            <div>
              <label htmlFor="xp_value" className="block text-sm font-medium leading-6 text-[#3B2D4A]">
                XP Value (Aura Points)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="xp_value"
                  id="xp_value"
                  defaultValue={event.xp_value || 5}
                  className="block w-full rounded-2xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#EBE0F8] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#E5C1FA] sm:text-sm sm:leading-6"
                />
              </div>
            </div>`
  );
  fs.writeFileSync('app/admin/events/[id]/edit/page.tsx', editPage);
}
console.log('Done');
