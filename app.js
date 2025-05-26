const BASE_URL = 'https://fakestoreapi.com';

const productosDiv = document.getElementById('productos');
const productoBuscadoDiv = document.getElementById('productoBuscado');
const crearResultadoDiv = document.getElementById('crearResultado');
const mensajeCopiadoTexto = document.getElementById('mensaje-copiado-texto');
const mensajeCopiadoEmoji = document.getElementById('mensaje-copiado-emoji');

let productosCache = [];

async function getAllProducts() {
  productosDiv.innerHTML = 'Cargando productos...';
  try {
    const res = await fetch(`${BASE_URL}/products`);
    productosCache = await res.json();
    renderProductos(productosCache);
  } catch (error) {
    productosDiv.innerHTML = 'Error al cargar productos';
    console.error(error);
  }
}

async function getProductById(id) {
  productoBuscadoDiv.innerHTML = 'Buscando producto...';
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    const p = await res.json();
    productoBuscadoDiv.innerHTML = `
      <div class="producto">
        <h6>${p.title}</h6>
        <p>Precio: $${p.price}</p>
        <p>Categoría: ${p.category}</p>
        <p>${p.description}</p>
      </div>
    `;
  } catch (error) {
    productoBuscadoDiv.innerHTML = error.message;
  }
  document.getElementById('buscarId').value = '';
}

async function createProduct(title, price, category) {
  crearResultadoDiv.innerHTML = 'Creando producto...';
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        price: parseFloat(price),
        description: 'Generado desde frontend',
        image: '',
        category
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al crear producto');
    const data = await res.json();
    crearResultadoDiv.innerHTML = `Producto creado: ${data.title}`;
    productosCache.push(data);
    renderProductos(productosCache);
    limpiarFormulario();
  } catch (error) {
    crearResultadoDiv.innerHTML = error.message;
  }
}

async function eliminarProducto(id) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    productosCache = productosCache.filter(p => p.id !== id);
    renderProductos(productosCache);
  } catch (error) {
    alert(error.message);
  }
}

function renderProductos(lista) {
  productosDiv.innerHTML = lista.map(p => `
    <div class="producto" id="producto-${p.id}">
      <h6>${p.title}</h6>
      <p>Precio: $${p.price}</p>
      <p>Categoría: ${p.category}</p>
      <button onclick="eliminarProducto(${p.id})">Eliminar</button>
    </div>
  `).join('');
}

function limpiarFormulario() {
  document.getElementById('nuevoTitulo').value = '';
  document.getElementById('nuevoPrecio').value = '';
  document.getElementById('nuevaCategoria').value = '';
  document.getElementById('buscarId').value = '';
  document.getElementById('inputTexto').value = '';
  document.getElementById('textoConvertido').textContent = '';
  if (mensajeCopiadoTexto) mensajeCopiadoTexto.style.display = 'none';
  if (mensajeCopiadoEmoji) mensajeCopiadoEmoji.style.display = 'none';
}

document.getElementById('recargar').addEventListener('click', () => {
  limpiarFormulario();
  getAllProducts();
});

document.getElementById('buscarBtn').addEventListener('click', () => {
  const id = document.getElementById('buscarId').value.trim();
  if (id) getProductById(id);
});

document.getElementById('crearBtn').addEventListener('click', () => {
  const title = document.getElementById('nuevoTitulo').value.trim();
  const price = document.getElementById('nuevoPrecio').value.trim();
  const category = document.getElementById('nuevaCategoria').value.trim();
  if (title && price && category) {
    createProduct(title, price, category);
  } else {
    crearResultadoDiv.innerHTML = 'Completar todos los campos para crear producto';
  }
});

window.eliminarProducto = eliminarProducto;

function copiarEmoji(elemento) {
  const texto = elemento.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    mensajeCopiadoEmoji.style.display = 'block';
    setTimeout(() => { mensajeCopiadoEmoji.style.display = 'none'; }, 2000);
  });
}

function convertirTexto(texto, fuente) {

  const mapNegrita = {
    A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆',
    H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍',
    O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔',
    V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
    a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠',
    h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧',
    o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮',
    v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳'
  };

  const mapItalica = {
    A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺',
    H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀', N: '𝑁',
    O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈',
    V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
    a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔',
    h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚', n: '𝑛',
    o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢',
    v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧'
  };

    const mapMono = {
    A: '𝙰', B: '𝙱', C: '𝙲', D: '𝙳', E: '𝙴', F: '𝙵', G: '𝙶',
    H: '𝙷', I: '𝙸', J: '𝙹', K: '𝙺', L: '𝙻', M: '𝙼', N: '𝙽',
    O: '𝙾', P: '𝙿', Q: '𝚀', R: '𝚁', S: '𝚂', T: '𝚃', U: '𝚄',
    V: '𝚅', W: '𝚆', X: '𝚇', Y: '𝚈', Z: '𝚉',
    a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐',
    h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗',
    o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞',
    v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣'
  };

    const mapBurbujaNegra = {
    A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖',
    H: '🅗', I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝',
    O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤',
    V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩',
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩'
  };

  const mapCursiva = {
    a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ',
    h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃',
    o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊',
    v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
    A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢',
    H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ', N: '𝒩',
    O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰',
    V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵'
  };

  const nobleMap = {
    a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "𝑒", f: "𝒻", g: "𝑔",
    h: "𝒽", i: "𝒾", j: "𝒿", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃",
    o: "𝑜", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉", u: "𝓊",
    v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
    A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮",
    H: "𝑯", I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴", N: "𝑵",
    O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻", U: "𝑼",
    V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁"
  };

  const mapGothic = {
    a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤',
    h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫',
    o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲',
    v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷',
    A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊',
    H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑',
    O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘',
    V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ'
  };

  const mapMedieval = {
    a:'𝖆', b:'𝖇', c:'𝖈', d:'𝖉', e:'𝖊', f:'𝖋', g:'𝖌', h:'𝖍', i:'𝖎',
    j:'𝖏', k:'𝖐', l:'𝖑', m:'𝖒', n:'𝖓', o:'𝖔', p:'𝖕', q:'𝖖', r:'𝖗',
    s:'𝖘', t:'𝖙', u:'𝖚', v:'𝖛', w:'𝖜', x:'𝖝', y:'𝖞', z:'𝖟',
    A:'𝕬', B:'𝕭', C:'𝕮', D:'𝕯', E:'𝕰', F:'𝕱', G:'𝕲', H:'𝕳',
    I:'𝕴', J:'𝕵', K:'𝕶', L:'𝕷', M:'𝕸', N:'𝕹', O:'𝕺', P:'𝕻',
    Q:'𝕼', R:'𝕽', S:'𝕾', T:'𝕿', U:'𝖀', V:'𝖁', W:'𝖂', X:'𝖃',
    Y:'𝖄', Z:'𝖅'
  };

  const mapDobleLinea = {
    a:'𝕒', b:'𝕓', c:'𝕔', d:'𝕕', e:'𝕖', f:'𝕗', g:'𝕘', h:'𝕙', i:'𝕚',
    j:'𝕛', k:'𝕜', l:'𝕝', m:'𝕞', n:'𝕟', o:'𝕠', p:'𝕡', q:'𝕢', r:'𝕣',
    s:'𝕤', t:'𝕥', u:'𝕦', v:'𝕧', w:'𝕨', x:'𝕩', y:'𝕪', z:'𝕫',
    A:'𝔸', B:'𝔹', C:'ℂ', D:'𝔻', E:'𝔼', F:'𝔽', G:'𝔾', H:'ℍ',
    I:'𝕀', J:'𝕁', K:'𝕂', L:'𝕃', M:'𝕄', N:'ℕ', O:'𝕆', P:'ℙ',
    Q:'ℚ', R:'ℝ', S:'𝕊', T:'𝕋', U:'𝕌', V:'𝕍', W:'𝕎', X:'𝕏',
    Y:'𝕐', Z:'ℤ', 0:'𝟘', 1:'𝟙', 2:'𝟚', 3:'𝟛', 4:'𝟜', 5:'𝟝',
    6:'𝟞', 7:'𝟟', 8:'𝟠', 9:'𝟡'
  };

  const mapPequeña = {
    a:'ᵃ', b:'ᵇ', c:'ᶜ', d:'ᵈ', e:'ᵉ', f:'ᶠ', g:'ᵍ', h:'ʰ', i:'ᶦ',
    j:'ʲ', k:'ᵏ', l:'ˡ', m:'ᵐ', n:'ⁿ', o:'ᵒ', p:'ᵖ', q:'ᑫ', r:'ʳ',
    s:'ˢ', t:'ᵗ', u:'ᵘ', v:'ᵛ', w:'ʷ', x:'ˣ', y:'ʸ', z:'ᶻ',
    A:'ᴬ', B:'ᴮ', C:'ᶜ', D:'ᴰ', E:'ᴱ', F:'ᶠ', G:'ᴳ', H:'ᴴ', I:'ᴵ',
    J:'ᴶ', K:'ᴷ', L:'ᴸ', M:'ᴹ', N:'ᴺ', O:'ᴼ', P:'ᴾ', Q:'Q', R:'ᴿ',
    S:'ˢ', T:'ᵀ', U:'ᵁ', V:'ⱽ', W:'ᵂ', X:'ˣ', Y:'ʸ', Z:'ᶻ'
  };

  const mapBurbuja = {
    a:'ⓐ', b:'ⓑ', c:'ⓒ', d:'ⓓ', e:'ⓔ', f:'ⓕ', g:'ⓖ', h:'ⓗ', i:'ⓘ',
    j:'ⓙ', k:'ⓚ', l:'ⓛ', m:'ⓜ', n:'ⓝ', o:'ⓞ', p:'ⓟ', q:'ⓠ', r:'ⓡ',
    s:'ⓢ', t:'ⓣ', u:'ⓤ', v:'ⓥ', w:'ⓦ', x:'ⓧ', y:'ⓨ', z:'ⓩ',
    A:'Ⓐ', B:'Ⓑ', C:'Ⓒ', D:'Ⓓ', E:'Ⓔ', F:'Ⓕ', G:'Ⓖ', H:'Ⓗ',
    I:'Ⓘ', J:'Ⓙ', K:'Ⓚ', L:'Ⓛ', M:'Ⓜ', N:'Ⓝ', O:'Ⓞ', P:'Ⓟ',
    Q:'Ⓠ', R:'Ⓡ', S:'Ⓢ', T:'Ⓣ', U:'Ⓤ', V:'Ⓥ', W:'Ⓦ', X:'Ⓧ',
    Y:'Ⓨ', Z:'Ⓩ'
  };

  const mapInvertida = {
    a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ', i:'ᴉ', j:'ɾ', k:'ʞ', l:'ʃ', m:'ɯ', n:'u', o:'o', p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
    A:'∀', B:'𐐒', C:'Ɔ', D:'◖', E:'Ǝ', F:'Ⅎ', G:'פ', H:'H', I:'I', J:'ſ', K:'⋊', L:'˥', M:'W', N:'N', O:'O', P:'Ԁ', Q:'Ό', R:'ᴚ', S:'S', T:'┴', U:'∩', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z',
    '0':'0', '1':'Ɩ', '2':'ᄅ', '3':'Ɛ', '4':'ㄣ', '5':'ϛ', '6':'9', '7':'ㄥ', '8':'8', '9':'6',
    '.':'˙', ',':'\'', '\'':',', '"':',,', '`':',', ';':'؛', '!':'¡', '?':'¿', '(':')', ')':'(', '[':']', ']':'[', '{':'}', '}':'{', '<':'>', '>':'<', '&':'⅋', '_':'‾'
  };

  const mapRevolution = {
    A: '卂', B: '乃', C: '匚', D: 'ᗪ', E: '乇', F: '千', G: 'Ꮆ',
    H: '卄', I: '丨', J: 'ﾌ', K: 'Ҝ', L: 'ㄥ', M: '爪', N: '几',
    O: 'ㄖ', P: '卩', Q: 'Ɋ', R: '尺', S: '丂', T: 'ㄒ', U: 'ㄩ',
    V: 'ᐯ', W: '山', X: '乂', Y: 'ㄚ', Z: '乙',
    a: '卂', b: '乃', c: '匚', d: 'ᗪ', e: '乇', f: '千', g: 'Ꮆ',
    h: '卄', i: '丨', j: 'ﾌ', k: 'Ҝ', l: 'ㄥ', m: '爪', n: '几',
    o: 'ㄖ', p: '卩', q: 'Ɋ', r: '尺', s: '丂', t: 'ㄒ', u: 'ㄩ',
    v: 'ᐯ', w: '山', x: '乂', y: 'ㄚ', z: '乙'
  };

  const mapProtesta = {
    A: '🄰', B: '🄱', C: '🄲', D: '🄳', E: '🄴', F: '🄵', G: '🄶',
    H: '🄷', I: '🄸', J: '🄹', K: '🄺', L: '🄻', M: '🄼', N: '🄽',
    O: '🄾', P: '🄿', Q: '🅀', R: '🅁', S: '🅂', T: '🅃', U: '🅄',
    V: '🅅', W: '🅆', X: '🅇', Y: '🅈', Z: '🅉',
    a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶',
    h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽',
    o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄',
    v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉'
  };

  const mapSubversiva = {
    A: 'λ', B: 'ß', C: 'Ↄ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: 'ƃ',
    H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N',
    O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩',
    V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
    a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ',
    h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u',
    o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n',
    v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z'
  };

  const mapas = {
    negrita: mapNegrita,
    italica: mapItalica,
    mono: mapMono,
    burbujaNegra: mapBurbujaNegra,
    cursive: mapCursiva,
    noble: nobleMap,
    unifraktur: mapGothic,
    medieval: mapMedieval,
    dobleLinea: mapDobleLinea,
    pequeña: mapPequeña,
    burbuja: mapBurbuja,
    invertida: mapInvertida,
    revolution: mapRevolution,
    protesta: mapProtesta,
    subversiva: mapSubversiva
  };

  const mapa = mapas[fuente];
  if (!mapa) return texto;

  let convertido = texto.split('').map(c => mapa[c] || c).join('');
  return fuente === 'invertida' ? convertido.split('').reverse().join('') : convertido;
}

function actualizarConvertidor() {
  const texto = document.getElementById('inputTexto').value;
  const fuente = document.getElementById('selectorFuente').value;
  const divConvertido = document.getElementById('textoConvertido');
  const textoConvertido = convertirTexto(texto, fuente);
  divConvertido.textContent = textoConvertido;
}

function copiarTextoConvertido() {
  const texto = document.getElementById('textoConvertido').textContent;
  const mensaje = document.getElementById('mensaje-copiado-texto');
  navigator.clipboard.writeText(texto).then(() => {
    if (mensaje) {
      mensaje.style.display = 'block';
      setTimeout(() => { mensaje.style.display = 'none'; }, 2000);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputTexto').addEventListener('input', actualizarConvertidor);
  document.getElementById('selectorFuente').addEventListener('change', actualizarConvertidor);
  limpiarFormulario();
  getAllProducts();
  window.scrollTo(0, 0);
});