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

  const mapBurbuja = {
    a:'ⓐ', b:'ⓑ', c:'ⓒ', d:'ⓓ', e:'ⓔ', f:'ⓕ', g:'ⓖ', h:'ⓗ', i:'ⓘ',
    j:'ⓙ', k:'ⓚ', l:'ⓛ', m:'ⓜ', n:'ⓝ', o:'ⓞ', p:'ⓟ', q:'ⓠ', r:'ⓡ',
    s:'ⓢ', t:'ⓣ', u:'ⓤ', v:'ⓥ', w:'ⓦ', x:'ⓧ', y:'ⓨ', z:'ⓩ',
    A:'Ⓐ', B:'Ⓑ', C:'Ⓒ', D:'Ⓓ', E:'Ⓔ', F:'Ⓕ', G:'Ⓖ', H:'Ⓗ',
    I:'Ⓘ', J:'Ⓙ', K:'Ⓚ', L:'Ⓛ', M:'Ⓜ', N:'Ⓝ', O:'Ⓞ', P:'Ⓟ',
    Q:'Ⓠ', R:'Ⓡ', S:'Ⓢ', T:'Ⓣ', U:'Ⓤ', V:'Ⓥ', W:'Ⓦ', X:'Ⓧ',
    Y:'Ⓨ', Z:'Ⓩ'
  };

  const mapPequeña = {
    a:'ᵃ', b:'ᵇ', c:'ᶜ', d:'ᵈ', e:'ᵉ', f:'ᶠ', g:'ᵍ', h:'ʰ', i:'ᶦ',
    j:'ʲ', k:'ᵏ', l:'ˡ', m:'ᵐ', n:'ⁿ', o:'ᵒ', p:'ᵖ', q:'ᑫ', r:'ʳ',
    s:'ˢ', t:'ᵗ', u:'ᵘ', v:'ᵛ', w:'ʷ', x:'ˣ', y:'ʸ', z:'ᶻ',
    A:'ᴬ', B:'ᴮ', C:'ᶜ', D:'ᴰ', E:'ᴱ', F:'ᶠ', G:'ᴳ', H:'ᴴ', I:'ᴵ',
    J:'ᴶ', K:'ᴷ', L:'ᴸ', M:'ᴹ', N:'ᴺ', O:'ᴼ', P:'ᴾ', Q:'Q', R:'ᴿ',
    S:'ˢ', T:'ᵀ', U:'ᵁ', V:'ⱽ', W:'ᵂ', X:'ˣ', Y:'ʸ', Z:'ᶻ'
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

  const mapInvertida = {
    a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ', i:'ᴉ', j:'ɾ', k:'ʞ', l:'ʃ', m:'ɯ', n:'u', o:'o', p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
    A:'∀', B:'𐐒', C:'Ɔ', D:'◖', E:'Ǝ', F:'Ⅎ', G:'פ', H:'H', I:'I', J:'ſ', K:'⋊', L:'˥', M:'W', N:'N', O:'O', P:'Ԁ', Q:'Ό', R:'ᴚ', S:'S', T:'┴', U:'∩', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z',
    '0':'0', '1':'Ɩ', '2':'ᄅ', '3':'Ɛ', '4':'ㄣ', '5':'ϛ', '6':'9', '7':'ㄥ', '8':'8', '9':'6',
    '.':'˙', ',':'\'', '\'':',', '"':',,', '`':',', ';':'؛', '!':'¡', '?':'¿', '(':')', ')':'(', '[':']', ']':'[', '{':'}', '}':'{', '<':'>', '>':'<', '&':'⅋', '_':'‾'
  };

  const mapas = {
    cursive: mapCursiva,
    unifraktur: mapGothic,
    dobleLinea: mapDobleLinea,
    burbuja: mapBurbuja,
    pequeña: mapPequeña,
    invertida: mapInvertida,
    medieval: mapMedieval
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

  const fuentesCSS = {
    pressStart: "'Press Start 2P', monospace",
    unifraktur: "'UnifrakturCook', serif",
    cursive: "'Cursive', cursive",
    monospace: "'Cascadia Mono', monospace",
    serif: "'Times New Roman', serif",
    medieval: "'UnifrakturMaguntia', serif"
  };

  divConvertido.style.fontFamily = fuentesCSS[fuente] || fuentesCSS.serif;
  divConvertido.style.fontStyle = fuente === 'cursive' ? 'italic' : 'normal';
  divConvertido.style.fontWeight = 'normal';
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