const fs = require('fs');
const file = 'src/app/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldSection = `            {/* ── TAB: Document Processing ── */}
            {galleryTab === 'docs' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { src: '/doc-processing/doc1.jpg', title: 'Passport Processing', tag: 'Passport' },
                  { src: '/doc-processing/doc2.jpg', title: 'Birth Certificate', tag: 'Certificates' },
                  { src: '/doc-processing/doc3.jpg', title: 'Sim Registration', tag: 'MTN Agent' },
                  { src: '/doc-processing/doc4.jpg', title: 'NHIS Cards', tag: 'Health' },
                  { src: '/doc-processing/doc5.jpg', title: 'Attestation Letters', tag: 'Legal' },
                  { src: '/doc-processing/doc6.jpg', title: 'Affidavits', tag: 'Legal' },
                ].map((item, i) => (
                  <GalleryCard key={i} src={item.src} title={item.title} tag={item.tag} hint={\`Add your flyer to /public/doc-processing/doc\${i + 1}.jpg\`} />
                ))}
              </div>
            )}`;

const newSection = `            {/* ── TAB: Document Processing ── */}
            {galleryTab === 'docs' && (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <GalleryCard src="/doc-processing/doc1.jpg" title="Document Processing" tag="Certified Docs" hint="Add your flyer to /public/doc-processing/doc1.jpg" />
                </div>
              </div>
            )}`;

if (c.includes(oldSection)) {
  c = c.replace(oldSection, newSection);
  fs.writeFileSync(file, c, 'utf8');
  console.log('SUCCESS: Doc tab updated to single card');
} else {
  console.log('NOT FOUND - checking for marker...');
  console.log('Has Passport Processing:', c.includes('Passport Processing'));
}
