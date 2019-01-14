import '../src';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<section class="skip__container" aria-labelledby="skip-link">
      <a id="skip-link" class="skip__btn" tabindex="0" href="#content">Skip to main content</a>
    </section>
    <main id="content"></main>`;
};

describe(`Initialisation`, () => {
    
  beforeAll(init);

  it('should attach a hashchange eventListener', () => {
    
    window.location.hash = '#content';
    console.log('hash: ', window.location.hash);
  
  });
  
  it('should ignore any hashes that do not match element ids', () => {
    
    window.location.hash = '#not-matched';
    console.log('hash: ', window.location.hash);
  
  });
  
  it('should find any ids matching the new hash and focus on them', () => {
  
    window.location.hash = '#test-2';
    console.log('hash: ', window.location.hash);
  
  });

});


