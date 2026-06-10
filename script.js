let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

canvas.style.backgroundColor = "black";

let fontSize = 20;
let columns = canvas.width / fontSize;
let letters = "♡";

let drops = [];

function initDrops() {
  columns = canvas.width / fontSize;
  drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }
}

initDrops();
window.addEventListener("resize", () => {
  initDrops();
});

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f7e299";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    if (drops[i] && drops[i] * fontSize) {
      ctx.fillText(letters, i * fontSize, drops[i] * fontSize);
    }

    if (
      drops[i] &&
      drops[i] * fontSize > canvas.height &&
      Math.random() > 0.975
    ) {
      drops[i] = 0;
    }

    if (drops[i] !== undefined) {
      drops[i]++;
    }
  }
}

setInterval(draw, 44);

document.addEventListener("DOMContentLoaded", () => {
  /* ELEMENTOS */
  const audio = document.getElementById("audio");
  const progress = document.getElementById("progress");
  const progressContainer = document.getElementById("progressContainer");
  const playBtn = document.getElementById("play");
  const backBtn = document.getElementById("back");
  const nextBtn = document.getElementById("next");

  const currentTimeEl = document.getElementById("pregresso");
  const remainingTimeEl = document.getElementById("timeRestante");

  const musicName = document.querySelector(".nome-music h2");
  const artistName = document.querySelector(".nome-music p");

  if (audio) audio.volume = 0.8;

  /* PLAYLIST - CORRIGIDO */
  const songs = [
    {
      title: "Infinito Particular",
      artist: "Mrisa Monte",
      src: "musics/Infinito Particular - Marisa Monte.mp3",
    },
    {
      title: "O Mundo é Nosso",
      artist: "Duduzinho",
      src: "musics/O Mundo É Nosso - MC Duduzinho.mp3",
    },
    {
      title: "Pupila",
      artist: "Ana Vitória | Vitor Kley",
      src: "musics/ANAVITÓRIA, Vitor Kley - Pupila.mp3",
    },
    {
      title: "Serenata Existencialista",
      artist: "O grilo",
      src: "musics/O Grilo - Serenata Existencialista.mp3",
    },
    {
      title: "Meio a Meio II",
      artist: "TheGust",
      src: "musics/Meio a Meio II - TheGusT MC's.mp3",
    },
    {
      title: "Portugal",
      artist: "Kawe | Ananda",
      src: "musics/Portugal - Kawe & Ananda.mp3",
    },
    {
      title: "Garota de Ipanema",
      artist: "Tom Jobim",
      src: "musics/Tom Jobim  Garota de Ipanema.mp3",
    },
    {
      title: "Partilhar",
      artist: "Rubel",
      src: "musics/Rubel - Partilhar.mp3",
    },
    {
      title: "O Velho e a Flor",
      artist: "Toquinho | Vinicius",
      src: "musics/Toquinho e Vinicius - O Velho e a Flor.mp3",
    },
    {
      title: "Vem Cá",
      artist: "Altamira",
      src: "musics/Vem Cá - ALTAMIRA.mp3",
    },
    {
      title: "Abertura Nanatsu no Taizai",
      artist: "Miura Jam",
      src: "musics/NANATSU NO TAIZAI.mp3",
    },
  ];

  let currentSong = Math.floor(Math.random() * songs.length);

  function loadSong(index) {
    const song = songs[index];
    if (!song) return;

    if (audio.pause) audio.pause();
    if (audio.currentTime) audio.currentTime = 0;
    if (progress) progress.style.width = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (remainingTimeEl) remainingTimeEl.textContent = "0:00";

    if (audio) {
      audio.src = song.src;
      audio.load();
    }

    if (musicName) musicName.textContent = song.title;
    if (artistName) artistName.textContent = "- " + song.artist + " -";
  }

  if (songs.length > 0) loadSong(currentSong);

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (audio.paused)
        audio.play().catch(() => console.log("Erro ao reproduzir"));
      else audio.pause();
    });
  }

  if (audio) {
    audio.addEventListener("play", () => {
      if (playBtn) playBtn.src = "images/Pause.png";
    });
    audio.addEventListener("pause", () => {
      if (playBtn) playBtn.src = "images/Play.png";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSong = (currentSong + 1) % songs.length;
      loadSong(currentSong);
      audio.play();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      currentSong = (currentSong - 1 + songs.length) % songs.length;
      loadSong(currentSong);
      audio.play();
    });
  }

  if (audio) {
    audio.addEventListener("ended", () => {
      currentSong = (currentSong + 1) % songs.length;
      loadSong(currentSong);
      audio.play();
    });
  }

  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;

      const percent = (audio.currentTime / audio.duration) * 100;
      if (progress) progress.style.width = percent + "%";

      if (currentTimeEl)
        currentTimeEl.textContent = formatTime(audio.currentTime);
      if (remainingTimeEl)
        remainingTimeEl.textContent = formatTime(
          audio.duration - audio.currentTime,
        );
    });
  }

  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      if (remainingTimeEl)
        remainingTimeEl.textContent = formatTime(audio.duration);
      if (progress) progress.style.width = "0%";
    });
  }

  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      if (!audio.duration) return;

      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      const percent = clickX / width;
      audio.currentTime = percent * audio.duration;
    });
  }

  function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }

  /* CARROSSEL */
  const slide = document.querySelectorAll(".slide");
  const btnright = document.getElementById("right");
  const btnleft = document.getElementById("left");

  let slideatual = 0;

  function atualizarBotoes() {
    if (btnleft) {
      btnleft.classList.toggle("btn-hidden", slideatual === 0);
    }

    if (btnright) {
      btnright.classList.toggle("btn-hidden", slideatual === slide.length - 1);
    }
  }
  function hideslide() {
    slide.forEach((item) => item.classList.remove("on"));
  }

  function showslide() {
    hideslide();

    if (slide[slideatual]) {
      slide[slideatual].classList.add("on");
    }

    atualizarBotoes();
  }

  function nextslide() {
    if (slideatual < slide.length - 1) {
      slideatual++;
      showslide();
    }
  }

  function prevslide() {
    if (slideatual > 0) {
      slideatual--;
      showslide();
    }
  }

  showslide();

  if (btnright) btnright.addEventListener("click", nextslide);
  if (btnleft) btnleft.addEventListener("click", prevslide);

  /* ARRASTAR CARROSSEL NO CELULAR / TABLET */
  const containerSlides = document.querySelector(".container-slides");

  let touchStartX = 0;
  let touchEndX = 0;

  if (containerSlides) {
    containerSlides.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    containerSlides.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const distancia = touchStartX - touchEndX;

    if (Math.abs(distancia) < 50) return;

    if (distancia > 0) {
      nextslide();
    } else {
      prevslide();
    }
  }

  /* CARTAS */
  const cartas = {
    1: `Oii, então eu to escrevendo isso na intenção de te entregar no dia em que eu te pedir em namoro sksks eu já queria fazer isso antes mas comecei hoje, você provavelmente notou que eu to meio aéreo e perguntando coisas aleatórias pra ver se distrai enquanto eu escrevo sksksks pretendo escrever de acordo no que eu vou pensando e no final vou te entregar a carta. Porque to fazendo isso? Porque eu sou meio burro e a ideia das flores deu tudo errado sksksk eu não faço ideia do que te dar sksksk na verdade to nervoso comprei umas duas alianças e tive que devolver porque queria te dar algo que você gostaria, mas esse nem é o ponto de hoje, queria falar que to ansioso pra pedir, eu conversei com seus pais antes de qualquer coisa (foi no dia em que você saiu com suas amigas)mas vai ter outra conversa provavelmente, na verdade dei muito na cara já, te dei um monte de dicas e dessa vez foi de propósito porque você disse que eu nem dei dicas na última vez.

Enfim  o que eu queria falar hoje era mais um resumo do que aconteceu até agora e queria dizer que eu definitivamente to sem ideia do buquê sksksk eu acho a coisa mais brega do mundo mas eu sou muito brega com você então meio que casa bem sksksks. Mas talvez eu não te dê um buquê to pensando ainda no dia você vai ver e espero que eu consiga decidir, tinha pensado num buquê de doce mas você prefere salgado aí fiquei sem ideia. Ah e sobre o dia to pensando ainda, queria rápido, mas também em um dia especial, sendo sincero qualquer dia com você seria especial mas é aquilo queria que fosse no dia que a gente conversou e tudo aconteceu, foi numa quinta se não me engano mas eu não lembro o dia sksksksk. Por enquanto é isso até amanhã e espero ter a resposta paro o seu presente
`,
    2: `Vamos lá, ontem foi o pré batismo e eu tinha algumas coisas pra escrever mas preferi conversar com você um pouquinho antes de dormir e eu acabei não escrevendo nada. Então começando com o de ontem, quebrei a cabeça mas não pensei em nada pra dar junto da caixinha e o anel, pensei em buquê, ursinho, caixa de presente mas não era o que faria sentido pro pedido, o buquê era minha ideia principal e eu não queria mudar masssss não sabia qual flor seria melhor queria fazer de girassol mas a única coisa que eu consegui pensar foi em um apelido bem diferente sksksks, ah e o apelido não é era o mesmo que eu te chamei ontem, era pra ser sunflower, mas fiquei com vergonha e acabei traduzindo o apelido, mesmo não sendo a mesma coisa foi legal sksksksks. Então voltando a parte do presente eu pensei em algum origami junto do buquê mas nenhum me chamou atenção, até pensei na rosa de origami mas não fica muito bonito, resumindo não sei o que fazer a mão pra você e juntamente não sei o que te dar junto do anel, por isso vou tentar pensar mais um pouco até chegar as coisas que eu comprei.`,
    3: `Agora falando sobre hoje chegou seu anel, e acho que dessa vez eu acertei depois de ter errado algumas vezes ksksks ele é muito bonitinho e acho que vai ser certinho pro seu dedo (eu espero), também espero ter acertado seu gosto, eu comprei um monte da mesma loja e fui devolvendo porque desistia dele mas agoraaaa tá perfeito foi a melhor escolha sksksksksk, então eu to com um enorme medo desse anel porque eu comprei ele online, e não foi em qualquer loja, além de ter comprado como prata mas ainda assim se essa bosta escurecer eu vou cacetar os vendedores que afirmaram que não iria escurecer fácil ksksks desculpa to meio nervoso no final só quero que você goste. Agora eu to esperando a caixinha chegar pra aliança e enquanto isso to pensando no que eu vou te dar junto da caixinha.

Obs: não vou te dar essa cartinha junto dos presentes sksksksk agora essas mensagens vão ficar pra mais pra frente depois de a gente ter um tempinho de namoro.`,
    4: `Oi Ana ainda é o Kayller do dia 05, acabei de voltar da igreja e to escrevendo isso pensando em não te mostrar, começando: muitas das vezes é difícil cada um se entender e por isso não percebemos que coisas simples podem se tornar irritantes nos momentos errados, eu sei que é difícil conversar sobre isso, mas eu queria te falar que eu brinco o tempo inteiro com tudo todas a coisas que eu faço lá na pit stop ou em qualquer outra lugar, como na igreja, eu sempre falo sorrindo ou com tom de brincadeira, mas isso é oque transparece pra mim e eu não posso te cobrar que interprete o que eu falo do jeito que eu falo principalmente durante o trabalho ou em dias que você tá exausta demais pra lidar com qualquer coisa, eu não to te falando isso tentando resolver, eu só queria encontrar uma forma de te contar que meu objetivo quando eu to perto de você é descontrair ou brincar com as situações para deixar o momento mais tranquilo, por exemplo eu saí hoje sorrindo da pit stop achando que fiz alguma coisa engraçada,eu não vi que o que eu falei pareceu como se eu não quisesse sua presença , eu sou meio esquisito? sou! Mas eu gosto muito de você e não queria que a gente convivesse com isso sem falar, mas eu sempre fico meio receoso de conversar sobre isso pessoalmente porque a gente quase não se vê e quando isso acontece eu não quero cansar você ou até mesmo entrar com uma discussão complicada e que acaba com o momento de distrair a cabeça do dia. Enfim desculpa por te dar mais um motivo pra você se cansar hoje e eu tenho pensando em como ajudar na sua rotina, entretanto eu não faço ideia do que você tá passando e não acho que eu possa ajudar. E mais uma coisinha eu to começando a achar que tenho que adiar alguns planos do pedido, porque queria que você se organizasse primeiro, talvez o pedido de namoro acabe virando um peso a mais para conciliar, por isso queria que você se organizasse primeiro, eu sempre vou estar aqui e eu quero muito que não se torne exaustivo fazer parte da sua vida, porque querendo ou não você ainda se parece comigo em alguns sentidos e se esgotar mais somente pioraria a situação.`,
    5: `Boaaaa noiteee minha princesa então hoje eu decidi tudo masss eu to lascado, vai demorar demais pro seu presente chegar, eu decide no final que vai ter um buquê de girassol porque eu encontrei o presente perfeito skskskks uma patinha igual a você só que ela vai vir de outro país entttão eu não sei quando vou fazer o pedido das flores já que elas eu só vou comprar um dia antes do pedido, e a patinha tá marcando de chegar lá pra dia 27 eu queria que fosse no início desse mês mas eu só encontrei isso depois, eu espero que seu pai não ache que eu to te enrolando já que faz um tempinho desde que eu e seus pais conversarmos, eu queria até achar um jeito de falar com ele sobre isso pra ele não me chamar de enrolado sksks mas é isso acho que não vou voltar a escrever até chegar a caixinha e os outros negócios.

`,
    6: `Oii é o seu benzinho de novo sksksksk gosto desse apelido, entt domingo(08/02) foi quando chegou a caixinha e sinceramente eu to imaginado o pedido desde aquele dia e também tava louco pra escrever só que fiquei um pouco ocupado então acabei não conseguindo e deixei pra segunda, mas segunda foi um dia ruim, muito ruim, no final eu acabei nem escrevendo nada, até por que eu quero realmente me dedicar pra escrever sksksksksksk pois então quando eu te vi domingo de vestido amarelo eu lembrei do girassol na mesma hora, ai eu pensei que realmente não tem como o buquê tem que ser de girassol não tem mais volta skskskskks é sério eu não sei como mas você tá cada dia mais bonita, sempre com um sorriso tão lindo e quando você fala é pior, o seu jeito mais calminha acalma meu lado agitado e eu acho isso uma ótima combinação skskksksks acho que você também acha. Agora falando mais sobre hoje eu fiquei muito tempo ansioso querendo te pedir logo em namoro, mas a patinha só chega mês que vem eu to a ponto de ficar louco queria pra ontem, quero ver sua reação sobre a pelúcia o mais rápido possível skksksks, até porque esse apelido você não gostou no início e só foi aceitando de pouquinho a pouquinho skskskskks. 
Agora resumindo essa terça (10/02) to ficando doido de ansiedade skskskskkssk.
Domingo queria te pedir em namoro o tempo inteiro skskksksks.
E segunda(09/02) vi a chuva e lembrei de como ela sempre fez parte de nós dois skskskskks e sinceramente valeu cada segundo estar com você e realmente a chuva faz você pensar demais principalmente na pessoa que você ama.

Ah e eu também to meio triste porque queria te dar algo a mão só que eu não faço ideia do que te dar, queria que tivesse significado pra nós dois, masssss pra falar a verdade eu só queria poder ver você sorrindo e feliz com o pedido então to pensando em um mundo de coisas pra ver esse sorrisinho . Também to com um pouco de medo não tenho certeza se vai ser um bom momento tenho medo de te sobrecarregar queria que fosse um momento bom pra você quando tudo tivesse mais tranquilo na sua vida mas todos os dias são bombas ainda mais pesadas encima de você e eu queria que o namoro não fosse algo que você tivesse que equilibrar junto eu to tentando acreditar que se Deus quiser vai tá mais tranquilo mais pra frente, enfim boa noite até alguma nova atualização.
`,
    7: `Olaaaa sou eu de novo sksksks (como se outra pessoa fosse escrever no meu lugar ) pois então não chegou sua pelúcia ainda masssss hoje aconteceu algo muito vergonhoso e eu queria te falar mas como tem haver com a “surpresa” eu não podia falar entttão por meio desta carta direi sksksksk agora contando oque aconteceu basicamente eu tava carregando algumas coisas que tinha que subir lá pro estoque da loja e quando eu peguei duas picareta, coloquei elas cada uma apoiada em um ombro, e fui pra fora da loja só que minha lerdeza bateu e eu fui pro meio da rua enquanto ficava olhando de um lado pro outro imaginado o seus pais vendo eu chegar com um pato de pelúcia pra ti e tipo eles vão ficar na cabeça: porque ? E você tipo porque esse garoto fez isso ? O que eu vou fazer com um pato sksksksksksk pelo menos espero que você ache fofo porque sério to nervoso com medo da sua reação, talvez seja exagero ? Concerteza! mas eu sei lá, minha mãe ficou falando que era muita coisa e que eu ia ficar sem ideia pra presente de dias dos namorados mas sério eu só queria poder ver seu sorriso e não me importa se é brega ou exagero skssksksksk agora é sério to nervoso demais, a minha princesa vai finalmente ser só minha e o melhor vou poder mostrar pra todo mundo que é só minha… te amo linda muitaaao bem grande sksksksks

Obs: a carta tá enorme to pensando oque eu faço queria te mostrar ela mais pra frente mas não sei se vou conseguir mostrar tudo
`,
    8: `Oii princesa, eu tava relendo essa cartinha antes de dormir e sabe oque eu percebi que mesmo quando você tá cansada, quase caindo morta você consegue acalmar meu dia, foi um dia complicado pra mim e quando eu pude conversar com você uns minutos mesmo sendo curto o tempo é falando nada com nada foi como se eu tivesse tomado um chá de boldo curou meu cansaço msksksksksks queria poder passar um pouquinho disso pra você pra vê se eu te animava um pouquinho skskskksk mas não tenho esse poder.. agora eu vou mesmo dormir boa noite princesa.
`,
    9: `Oi amor da minha vida como você está? Espero que um pouquinho feliz, poiiis então hoje é terça feira uma horinha da manhã (Dia 17/02, Metanoia foi ontem sksks)e eu tinha que escrever desdeee sábado ent tenho muita coisa pra falar por que eu deixei acumular, que que acontece eu to com sono ? to sim, mas eu to muito feliz porque hoje eu vi você arrumadinha do mesmo jeito que foi na formatura, foi super importante te ver naquele dia então aquele vestido chama muita minha atenção quando você veste ele skskksksks mas por enquanto vou parar de te admirar pra contar sobre oque aconteceu nestes três dias.
Sábado (14/02), eu tive uma ideia brilhante skksksks e eu espero que ela dê certo, na verdade a ideia foi ontem e eu comecei a fazer ela na mesma hora masss como eu fiquei meu sábado inteiro fazendo isso eu vou contar como se fosse hoje a ideia, entt eu nem te pedi em namoro ainda, mas já tenho ideia do seu presente de dia dos namorados, não vou fazer muito suspense porque essas cartinhas vão aparecer nele. basicamente vou fazer um site, nele vai conter coisas engraçadas e fofinhas sksksksk já tenho o esboço, eu vou colocar um música que seja marcante pros dois sooo que eu não faço ideia de qual, entretanto eu não preciso ter pressa posso descobrindo devagar as coisas, além disso vai ter todos os dias de cartinhas pra você ler todassss, e não vai se poucas porque até lá vai ter acumulado sksksksks hoje eu fiz o fundo de corações, concertei alguns bugs e comecei a pensar em como colocar uma cartinha Pokémon personalizada de nós dois eu me senti um gênio com essa cartinha espero que você goste.

Domingo (15/02) continuando na saga da página tive uma ideia de fazer tipo páginas de um caderno como um enfeite não vai ser muitto parecido por que minhas ideias são boas mas as habilidades falham sksksksk mas eu consegui o efeito que eu queria e tá ficando legal espero que você ache legal ter um site só pra você skskskkssk não fiz muitas outras coisas por falta de tempo e ideias, vou ver se segunda eu consigo fazer a carta Pokémon personalizada pra por no site, vou mexer terça feira e espero não ficar muito cansado ssksks, ah e eu não posso esquecer que hoje eu recebi um docinho de um certo alguém skksksks tava muito bom e eu tava pensando em comer enquanto fazia o site e sinceramente pensar em você, criar algo pra você e comer algo que você me deu são as melhores combinações possíveis tipo eu fico extremamente bem assim sksksksk foi divertido mexer no site esses dias porque eu realmente me esforcei pra fazer algo que você goste, por isso espero que por mais raiva que eu passe eu não quero desistir do site. Por hoje é só foi um dia perfeito pra mim porque foi cheio de você e receber um beijinho na bochecha seu faz eu trabalhar muito melhor sksksksks podia ser mais frequente viu ksksksk tipo todo minuto skskskskks. tchau patinha abraços e beijinhos.


Eeeee finalmente segunda(16/02) não deu pra fazer nada dia corrido demais mas sabe valeu a pena eu gostei de sair, de cultuar a Deus e me senti alegre lá, to morto? Sim! Mas você tava lá ent valeu ainda mais a pena, e pensar que eu perdi as melhores coisas da minha vida por tanto tempo, primeiro foi a Cristo e depois foi você eu tenho mais do que sorte nessa vida sksksksksk masss hoje não é isso que tem pra falar, hoje chegou !!! finalmente chegou a patinha e eu to querendo esse buquê pra ontemmmm pelo amor de Deus, eu vou te pedir em namoro antes de sair pra praia e era exatamente como eu queria eu fiquei muito triste quando pensei que teria que viajar sem te chamar de minha bebezinha mas eu vou conseguir skskskks Deus foi muito bom comigo, agora eu vou tentar comprar através de uma floricultura online e pedir que o tio Dimilson traga pra mim, agora tem que dar certo não posso atrasar isso eu vou ficar doido ksksksksks. Eu nem comentei mas as patinha é exatamente como você, eu lembro você de macacão no dia do aniversário da Maria e você tava tão fofa que eu tava derretendo por dentro e quando eu olho pra patinha eu fico exatamente assim pensando em você. Por hoje acabouuu infelizmente masss eu ainda vou escrever muitoooo pra você ,te amo beijinho, tchauuu.
`,
    10: `Madrugada do dia 17 pro dia 18: Começando a falar do dia eu mais dormi do que tudo sksksksk mas mesmo assim por mais que eu não tenha programado eu fiz a cartinha Pokémon e sério eu acho que você vai gostar por mais que seja a coisa mais aleatória do mundo eu acho que vai ser fofo sksksks tá do jeito que eu imaginei ksksk e eu consegui fazer mesmo que tenha demorado, agora só falta colocar no site e vou começar a quebrar a cabeça com que música eu coloco no site não faço ideia de como descobrir isso e eu espero que o mundo me ajude sksksksksk. 
Mas agora deixando de falar sobre o dia dos namorados e começando sobre o pedido: eu vou fazer isso na sexta o buquê vai vir nesse dia, eu ainda não comprei, mas já decidi a data, engraçado ssksksksk, mas é isso hoje eu falei que tava meio ansioso e era por isso to roendo os dente pra poder te pedir em namoro logo sksksksks.
ah eu to com muita vergonha cara eu tive que pedir o número de uma floricultura pra uma amiga da minha mãe lá de Ipatinga e minha mãe ficou conversando com ela e rindo skskskssk eu fiquei muito nervoso de você ter ouvido lá na pit stop, na verdade tem muita gente sabendo mais do que eu gostaria e eu to com medo de vazar pra você “”””espero conseguir fazer a surpresa”””” entre aspas porque você já sabe que eu te amo e sabe que quero você pra minha vida. Enfim por hoje é só ssksksks boa noite já tá dando 2 horinhas da manhã e eu to vendo que nesse pós carnaval eu vou trabalhar bastante ent to indo dormir, beijinhos te amooo.`,
    11: `Meu olho tá meio pesado sksksk mas hoje aconteceu sksksksk pensei em escrever antes de chegar na sua casa e te gritar mas eu tava tão nervoso que não tava conseguindo pensar direito, seu sorriso foi a única coisa que eu vi a noite inteira eu não tá conseguindo focar em mais nada, comecei a falar muita coisa que tinha me deixado nervoso pra você e quando eu percebia eu trava e me perguntava porque eu to falando tanta asneira sssksksk falei algumas coisinhas que estava na carta e algumas coisas não tão legais de se falar mas eu espero que você tenha ignorado, eu fiquei pensando no fato de que eu realmente to namorando agora e o melhor que é com você, espero que tenha gostado da mini você skskskksks. Outra coisa que eu  pensei também era sobre eu ter te pedido em namoro mas a ansiedade é tanta que já comecei o presente de dia dos namorados skkskskskk meio convencido você não acha? Já to fazendo como se você já tivesse aceitado antes de pedir skskskssk mas é isso, hoje foi um dia muito feliz.
Agora é hora de preparar outra surpresa skskskkd
`,
    12: `Madame eu sei que disse que iria dormir mas antes eu precisava escrever slskskdk hoje foi o dia de fazer o Music player, pensa numa coisa que eu pensei que ia ser fácil mas que tá me batendo, o mais difícil foi eu na minha burrice ter comentado com você e to tendo que disfarçar inventando um monte de besteira pra você não saber o que eu to fazendo ssksksksksk eu ia colocar a cartinha Pokémon hoje também mas eu travei com dois erros no Music player, vou fazer amanhã o resto sisksksksksk Boa noite sunny te amo.`,
    13: `Oii olha quem é, isso mesmo obviamente sou eu sksksksk hoje foi difícil quebrei porque quebrei minha cabeça em como colocaria essa cartinha Pokémon masss eu tive um grande ideia com isso colocar a gente em universos diferentes, o ruim é que minha memória é horrível então lembrar das coisas foi meio difícil mas eu tive uma ajuda do seu irmão sksksk mas eu fiquei num dilema de como colocaria no site que tipo de estética eu coloco, acabei pensando em como você reagiria e fui criando frases para cada referência e sinceramente eu ri e muito enquanto pensava em quando você veria isso. E definitivamente você tem um bom gosto pra dragões só tem preconceito com os coitadinhos sksksksk espero que você entenda a referência dos dragões na imagem, to indo pra igreja e to um pouquinho atrasado sksksks tchau tchau até amanhã princesa.
Pois então cheguei da igreja e não to conseguindo pregar o olho não to sabendo em como eu posso por as imagens no site, to sem ideia do design eu ja pesquisei de tudo, pedi ideias pro GPT mas ele não ajuda sksksk até que achei algo interessante, não sei se vai dar certo vou testar e já te escrevo sksksksk. 
Pois então não deu 100% certo, na verdade ficou 1000 vezes melhor do que eu pensei sksksksksksks agora eu vou deixar pra por amanhã no site já consegui montar o design de cada imagem e acho que você vai gostar também`,
    14: `Moça eu to indeciso sksksksk eu não sei como colocar o carrossel de imagens no site e tá meio difícil conversar com você sem contar sobre o site sksksksk é estranho falar com você sobre o que eu to fazendo sem nem poder falar nada skskskkss espero que você não tenha visto nenhum spoiler naquele vídeo aleatório de eu surtando com um código antigo sksksksksksk mas é isso, depois de ficar pensando e pensando eu vou ver se durmo, bye sunny
`,
    15: `tive uma ideia sksksksksksk mais uma no caso, não sei se coloco “What IF” ou “Eeee… se?” O problema da primeira é que só seria essa parte em inglês o bom é que faz muito sentido com o tema, eu literalmente tive essa ideia do nada nem to em casa ainda to no meio do serviço e tive essa ideia e acho que era o que faltava pra por no carrossel um título, chegando em casa eu vou ver se decido.
A noite:
boa noite branca e tenho um a má notícia eu ainda não decidi sksksksk mas eu consegui separar as setinhas que você clica para avançar ou voltar entres os slides, em resumo foi e não foi um dia produtivo skskskskks enfim por hoje foi isso beijinhos espero que esteja bem te amo
`,
    16: `Hoje foi difícil sksksk não brigamos, mas foi um final difícil, eu não consigo esquecer o quão difícil foi  não poder estar perto pra resolver as coisas, eu sei que nem tudo vai dar pra resolver cara a cara mas pelo menos esse eu realmente queria estar perto da minha criança com os olhinhos vermelhos, eu te amo garota e o que eu mais quero é tiver bem sksks 
eu to querendo te pedir algo desde ontem pra você, mas sei que é muito egoísmo meu por isso vou só escrever, eu queria muito poder te ver na noite do dia em que eu chegar, não muito, não precisa passar de 20 minutos mas eu sei como é a semana pra você, segunda feira tem escola, além de que você pode querer estudar sozinha também, por isso não quero que o nosso namoro venha te desviar do principal que eu seu futuro e sua saúde, até porque ficar acordada tarde não é bom, por hoje eu termino essa cartinha eu te amo você minha surtadinha, e não foi sua culpa o que aconteceu viu!! só disse que é minha surtadinha porque você mesmo falou que era surtada, e eu não concordo totalmente porque acho que isso é muito extremo, enfim boa noite linda beijinhos.
`,
    17: `Pois então gatinha skssksksk boa noite, desde a viagem pra Bahia teveee muita coisa e eu fiquei enrolando pra escrever, era mais cansaço e eu gosto de me dedicar pra escrever tinha até uma coisa muito importante para escrever no dia que eu cheguei mas eu acabei esquecendo sksksks olha seu presente deu uma estagnada por causa das minhas ideias sksksksk mas amanhã eu recomeço e vejo o que vai faltar pra terminar. Pois então porque eu resolvi escrever hoje? Simples ! Nos últimos dias a gente teve muitas conversas e a mais séria foi sobre o casamento e olha eu não imaginei que eu iria casar cedo mas eu aceitei esse ideia mais fácil do que eu imaginava skksksksks se for perguntar se tenho algum medo, eu tenho mas é mais no sentido de não ser bom o suficiente, agora a pessoa que eu escolhi com certeza foi a melhor possível não me arrependeria nem se tivesse que escolher 1 milhão de vezes você skskskksksks meio exagerado mas é minha forma de dizer que vou me casar com você e só com você.

Gatinha eu gosto bastante de pensar em você e é bom saber que vai ser você até o final, não acho que vai ser sempre fácil mas imaginar chegar em casa cansado e poder te ajudar a fazer as coisas não seria horrível, enfim sksksk boa noite gatinha e prometo as cartas vão ser mais constantes agora. Beijinhos
`,
    18: `Entaooooo como você tá princesa ? Sksksksk agora é 01h21 da manhã, mas eu tenho muito o que falar são coisas de dois dias sábado e domingo sksksksk por onde eu começo? Você tá bem gatinha? Espero que esteja se divertindo lendo isso sksksks mas eu comecei a pensar tem que ter paciência pra ler tudo lssksksksks tava pensando em como vou te entregar isso sksksks acho que vou me fingir de sonso e falar que esqueci do dia dos namorados Skskskkssksk mas não sei sou muito ansioso pra isso skskskzk. Pois então, esse fim de semana eu voltei a programar e tals e pra ser sincero tive progresso ksks só falta agora colocar essas cartinhas no site, massssss eu tô achando pouca coisa, queria colocar alguma coisa a mais no site mas como tem muitas cartas acha que desanima colocar mais coisas pra não te encher sksksksk e eu também não tenho ideias sksksksks todas que eu tive eu tinha que começar desde o início do site e agora não dá mais sksksksk, e tem outra eu tenho um péssimos senso de cores de verdade esse site tá ficando cada vez pior com minhas escolhas de cores skskskskskdk tem preto, amarelo, branco e agora bege eu tô sinto de enlouquecer que ta ficando cada vez pior sksksksksk eu vou separar um dia só pra mexer nas cores de tudo ksksksksksksk prováveis vou tirar um pico do amarelo e colocar bege porque as imagens em amarelo não ficam boas. Mas esquecendo essa parte horrorosa to em dúvida de como eu vou colocar essas cartas, tenho duas ideias na cabeça só que ainda tô meio em dúvida em como fazer funcionar, mas por fim é isso sobre o site pelo menos.

Agora falando um pouco sobre o que aconteceu hoje(26/04), tivemos um conversa legal, falei algo que tava incomodando e foi bom saber que os dois não queria isso sksksks foi divertido brincar com você imaginando o futuro, na verdade foi bom conversar com você ksk sempre é pra ser sincero, não vou estender muito hoje tô quase dormindo enquanto escrevo sksksks eu te amo minha gatinha eu  espero que você tenha gostado do site, eu tô aprendendo muita coisa enquanto faço ele entoa talvez nada fique perfeito dsksksk ah e um segredo eu fiquei horas vendo o carrossel de mundos alternativos enquanto  conversava com você e eu fiquei rindo muito porque era isso que eu queria dizer quando a gente tava falando sobre coisas que eu escondo de você, no caso eu só tinha isso a esconder skkssksksk eu queria te falar tanta coisa na hora sksksks na verdade toda vez que eu fazia algo do site minha vontade é te contar, te mostrar , saber se você gosta de algo assim ou de outro jeito mas fazer oque é pra ser surpresa skskskks bye bye, beijinhos patinha
`,
    19: `Madrugada do dia 01: Então tá de madrugada sksksk e eu devia ter ido dormir mas eu fiquei animado e quis fazer umas coisas pro seu presente sksksks não foi nada demais só mudei a algumas coisas, tipo cores que não tavam combinando com a estética da página sksksks eu pensei que nem ia mexer com o site essa semana mas acabou que eu fiquei meio animado sksksksksk eu já decidi como vou por as cartinhas no site, e já defini o design dos envelopes, agora só falta o design da carta aberta e aí por a mão na massa fazendo o site skksksks eu tô pensando o que é melhor, ou eu coloco tudo como imagem e você vai abrindo as cartas como imagens ou escrevo direto no site, eu to com receio de fazer direto no site porque as vezes fica meio feio, por mais que seja mais difícil vou acabar fazendo cada carta no canva e usando as imagens ksksksk. Princesa eu não posso falar muito porque já tá meio tarde então foi isso, boa noite gatinha por hoje é só skskskks beijo tchau
`,
    20: `Boa noite gatinha, era pra eu tá dormindo mas eu tô tanto tempo ocupado esses dia que não dá pra fazer algo pra você e isso tá me irritando, eu tô tentando escrever pra você desde que agente visitou minha bisavó mas eu sempre apago de cansaço sksksk eu não tenho muiiita coisa pra falar por que até agora não fiz nada, mas eu gosto de imaginar o tempo que eu passei com você, fazia um tempo que a gente não conversava sem se preocupar com tempo ou cansaço sksksks foi bom gatinha, eu me senti feliz em ver que você conheceu minha família não que eles sejam os mais engraçados ksksks mas não deixam de ser pontos marcantes principalmente em relação ao sítio sksksksms  durante  essa semana eu também fiquei bastante pensativo em qual música colocar no site, tentei de tudo semana passada pra achar algo que você gostaria, cheguei a inventar uma desculpa sksksks mas eu realmente já tava na ideia da gente jogar aqueles casos de detetives só foi uma desculpa muito ruim e improvisada que não fez sentido sksksksk  mas enfim eu decidi fazer um alteração no site o que provavelmente vai quebrar minha cabeça skkskskss eh vou fazer para que possa colocar várias músicas no site, como? eu não faço ideia sksksksksk mas fazer oque sksk amanhã ou sábado eu vou preparar o espaço pra colocar as cartas acho que já tá mais que na hora de terminar o site, talvez eu adicione mais cartas até chegar lá mas não sei se vou colocar elas.

É isso gatinha boa noite, Manhonte, eu te amo`,
    21: `Oiii moça como você tá ? Eu to com sono sksksk então eu já fiz muita coisa no site falta só colocar as cartas no site e eu consegui fazer uma playlist pra gente, o que não acho que ficou muito boa porque eu sou louco e fui colocando tudo quanto é tipo de músicas sksksksks eu tive uma ideia legal pra te entrega o presente, ate porque não sabia muito bem como entregar um site skskskksskks masssss acho que vai ser legal, o problema é que eu não sou criativo com as mini cartinhas já que tem que ser curto mas falar alguma coisa eu me perco porque sempre que eu penso eu boto móóóóó textão, você só vai ler isso depois de ver algumas cartinhas e eu espero que você tenha gostado da ideia o ruim é que a execução vai ficar uma bagunça já que vai ficar em ordem aleatória sksksksksk e eu meio que conversei entre as cartas, o plano era fazer 50 eu to no 30 e poucos agora não sei se vou fazer todas até porque minha mente só tá criando texto grande e não dá certo pro estilo que eu quero, independente de tudo vai ser divertido te ver abrindo ele, e eu to pensando meu presente é taooo grande que eu to com medo de gastar tempo demais na caixinha de envelopes e nem dá pra ver o site direito sksksksksk mas acho que o site pode ser uma experiência mais privada sua. Eu também to com um grande problema com o site eu até fiz ele pra celular o B.O é que não tão muito esteticamente atrativo sksksks e eu queria que você pudesse ver ele quando você quisesse mas acho que você vai ficar dependente de um pc, pelo menos as cartas da pra dar zoom na letra mas nem sei se fica muito bom no celular, espero que as coisas deem certo de qualquer forma, eu to tentando imaginar o que você vai fazer pra esse dia mas não faço ideia do que pode ser ksksksksksks.

Ahhh eu queria falar sobre esses dias eu tô vivendo uma fase de dormir todos os dias pensando em você não é um momento ou o futuro é só a minha branca, o que me faz ter mais certeza de que este com você não é o que me cansa, oq cansa é ficar longe skskskskks, mas basicamente isso faz meu cérebro ter tantos sonhos com você so que sempre são estranho o último que eu lembro por exemplo a gente tava casando mas nada dava certo e seu pai tava me encarando como se quisesse me comer ksksksksksksk mas independente de tudo ter acontecido no sonho o melhor foi que você estava lá.

Queria falar também sobre sua decisão sobre nossa casa colorida, isso me pegouuu de surpresa sksksk eu sempre pensei numa casa tão simples, quando eu ia morar sozinho, mas agora eu imagino um caso tão cheia de coisas, eu imagino coisas como crochê, cerâmica tudo espalhados pela casa, fruteiras, vasilhas, panos tudo de artesanato e imagino uma surpresa nova que você arrumou do nada no dia sksksksksk não é uma decisão ruim mas meio que fugiu muito da minha cabeça fugiu ssksksk mas acho que isso faz parte já que minha vida vai se juntar a sua e isso que vai fazer dar certo.

Por hoje é só gatinha, boa noite Manhonte sksksks a próxima carta provavelmente eu vou ter terminado o site então talvez eu não coloque mais cartinha, ou eu vou esperar a penúltima semana e terminar os envelopinhos, que eu espero conseguir fazer bonitinho. A é talvez eu adicione mais músicas na playlist também. Mas agora acabou mesmo eu disse tudo que tinha pra falar tchau patinha.`,
    22: `Oii gatinha como você tá? Hoje a gente fez bastante coisa sksksksk o aniversário da sua tia ajudou bastante , eu pude ficar um tempão com você, e ainda deu pra ficar depois, acho que eu tive sorte, mas voltando eu tô meio com sono então talvez na fale muito mas se eu puder dizer algo é que eu te amo independente de qualquer coisa, a gente já tá discutindo sobre a casa mas sendo sincero eu nem tava imaginando a casa em si e sim com quem eu vou estar, minha mãe falou algo hoje que martelou muito a minha cabeça, ela disse que pensou que eu iria ficar quieto por um tempo não iria namorar tão cedo e assim em tese eu concordei com ela sempre foquei muito no que eu queria fazer e pensar que eu teria que namorar por agora atrapalharia, mas eu não consigo imaginar eu não tomando minhas decisões dessa forma hoje, eu concerteza me arrependeria por deixar você esperando ou simplesmente dizendo não pra mim mesmo e que eu não deveria seguir com essas decisões, eu penso que perderia algo importante pra minha vida se tivesse adiado isso, e hoje é a melhor decisão da minha vida, eu sei que não é muito certo ser assim mas eu não consigo mais me imaginar sem você na minha vida, eu sou feliz hoje porque você é quem tira o cansaço acumulado da semana é quem faz a minha rotina não me matar e saber que você vai ser quem eu vou viver a minha vida me faz o homem mais feliz do mundo, a gente discutiu hoje sobre presentes aleatórios, eu tive essa ideia muitas vezes sksksksk mas uma coisa engraçada é que todas elas acabam se tornando muitos presente grandes, por exemplo essas cartinhas eram pra ser só pra entregar junto no pedido de namoro e agora tomou a proporção que está  agora, acho que eu sou um pouco emocionado sskskskkd mas acho que faz parte de mim e eu acho muito bom você gostar de mim assim, mas enfim eu adoraria receber um montão de coisas suas mas eu também queria poder fazer coisas pra você sksksksks lógico eu sou uma batata com isso, até porque meus hobbies não são tão simples, não sei como eu poderia fazer com cartas pokemon, jogos e programação sksksk se bem que programação eu já fiz sksksksksk não sei como eu posso demonstrar meu amor por você mas prometo sempre te dar o amor e carinho que você precise. Eu te amo branquela.
`,
    23: `Oii moça sksk então eu prometi dormir assim q eu acabasse então eu parei o que tava fazendo e vim escrever um pouquinho, sério gatinha eu tô pensando muito em você esses dias mas acho que é porque você me faz sentir especial eu tô ansioso pro meu presente eu sei como você sempre faz umas coisas incríveis que eu não sei fazer o que faz eu pensar em como na você é inteligente em muitas áreas, mas o que realmente tá me fazendo pensar agora é sobre as nossas discussões sobre a casa de ontem sksksksk não é nada demais, é só que eu nunca fui um pessoa muito de decorar as coisas e minha opinião normalmente é bem baixa com essas coisas mas com você parece que dá vontade de falar é como se eu fizesse só pra te contrariar skskksksks sendo sincero eu não imaginei a casa tantas vezes eu sempre que imagina o quarto, a sala, o teto eu só imagina a gente lá usando eles, não importa se o teto era amarelo o que importa era que eu tava vendo você olhando pra cima enquanto olhava pra mim convencida de que tava lindo e eu só concordava Sksksksksksk você falou comigo que eu tava julgando o sofá vinho mas o que eu realmente fiz foi imaginar uma coberta bem fina e nós dois dormindo no sofá por que decidimos sentar lá um pouco só pra conversar mas acabamos dormindo ksksksksd acho que não seria ruim um sofá vinho se parar pra pensar, mas agora sobre hoje eu fiquei o tempo todo estudando a palavra de Deus e é engraçado perceber que eu poderia estar mais distante do senhor se não tivesse tomado a iniciativa de tentarmos conversar nem que no início as coisas não tivessem sido as mil maravilhas sksksks mas ainda assim as coisas deram certo porque algumas iniciativas foram feitas e eu agradeço a Deus por isso e também a você por ainda ter insistido comigo, hoje eu pensei que deve ter machucado esse tempo mas eu queria que os problemas seja resolvidos com os momentos mais felizes que a gente possa ter, eu não sou a pessoa mais perfeita do mundo mas eu quero poder te amar pra sempre e demostrar isso, e definitivamente eu não quero ser o ogro que normalmente homens são. Eu te amo gatinha obrigado por tudo beijinho`,
    24: `Oiii linda como você está? Espero que bem, porque eu topo muito feliz sksksk eu não imaginei nunca que ganharia isso como presente de aniversario eu me senti uma criança, o que não vale, eu achei legal o fato de você ter a ideia de fazer muitas cartas durante os meses pena que não deu certo pra você mas deu pra mim sksksksksk não conta como roubar sua ideia porque tivemos ela quase que juntos skskskssk mas  é sério você é muito incrível gatinha não tem como, a menina faz de tudo sksksksks não pensei que ia conseguir fazer realmente um Pokémon de crochê (mesmo eu atiçando tanto) achei que no máximo ia ser a cabeça de um sksksk mas ela vai lá e faz, eu não duvido nem mais um segundo de que você consegue fazer, eu tô capengando de sono já, acabou que eu nem joguei nem nada sksksk mas eu também fiquei perdendo muito tempo vendo as cartas Pokémon e mexendo com o Bulbassaro, enfim obrigado por tudo princesa eu te amooo um montão. Boa noite, Manhonte.
`,
    25: `Oii, patinha.

Essa é minha última carta. Eu preciso subir o site pra internet, e fica meio difícil adiar por mais dias, então eu tô um pouco decepcionado. Minhas ideias foram todas colocadas no site, eu consegui fazer tudo que eu imaginei, mas eu não sei muito bem se ficou aquilo que eu coloquei tanta expectativa em você, ksksks. Eu queria te impressionar com algo que você pudesse visitar sempre que quisesse, um cantinho virtual nosso, mas, por mais que as ideias fossem legais, eu senti que ficaram meio sem nexo, sksksk.

Não tinha uma transição ou uma forma interativa de entender tudo, mas isso são detalhes que eu fui perceber depois que olhei bastante o site e fiquei pensando em como você receberia cada parte do presente. Eu já pensei em formas de resolver, mas, sendo sincero, não tenho mais tempo. Eu meio que deixei pra última hora.

Euuu sei que é burrice colocar essa carta no meio das outras, mas, como a minha ideia era ser totalmente transparente em todas as cartas e mostrar como foi estar com você todos os dias, eu acho importante também te mostrar todo o lado da história, sksksks. Se bem que a maior parte das cartas é sobre o presente, sksksk.

Eu não sei muito bem se você vai entender o presente, e quanto mais eu penso, mais esquisito fica quando você pensa que não tem uma área específica no site, só um monte de ideias brotando juntas, sksksksk. Eu acho que você vai gostar, mas sinto que tem coisinhas que eu podia fazer pra deixar mais especial pra você. E logicamente eu vou mexer com isso agora para ver se ficar melhor por mais que algumas ideias não dê pra fazer mais eu ainda vou usar meus últimos momentos para entregar o melhor pra você.

Eu te amo tanto, e esses dias foram difíceis pra mim fazer qualquer coisa, mas eu tenho pensado em como a gente está. Uma coisa é verdade: quanto mais eu penso, mais eu te quero pra mim. A gente sempre brinca sobre a saudade dificultar as coisas, mas eu meio que gosto de olhar uma foto sua no meio da faculdade e pensar que você, por mais séria que esteja, ainda tem o melhor sorriso do mundo. E quando você tá sorrindo, eu ainda lembro o quão compromissada você é com a vida.

Você tem vivido uma época difícil da sua vida. Você trabalha, estuda, namora e ainda tá tendo que decidir sobre seu futuro, isso tudo de uma vez. E, no início de tudo, quando eu tinha medo se podia te pedir em namoro por causa de te pressionar, eu meio que aos poucos fui tirando isso da minha cabeça e fui de cabeça em tudo.

Mas, às vezes, eu penso: que baita desafio eu coloquei nela. Foi meio egoísmo da minha parte, porque eu busquei a minha felicidade e talvez não tenha pensado tanto no seu futuro. Claro que pensei no seu futuro comigo, mas isso só me fez querer ainda mais ir com tudo.

Foi complicado, por assim dizer, mas é o maior orgulho da minha vida poder olhar pra vida e dizer que a pessoa que eu prejudiquei, por assim dizer, se sente feliz em viver algo comigo, sksksksksk.

Eu não sou o namorado mais sensato e, muitas das vezes, sou egoísta. Minhas decisões são escolhas que vão me fazer bem. Lógico que eu nunca iria querer te fazer mal, mas tenho medo de que isso possa acontecer. E é através daqui que eu espero que você entenda que somos dois, mas eu quero viver uma só carne com você. Quero que meus defeitos venham a ser resolvidos para que eu faça o melhor na sua vida.

Enfim, ksksks, é isso. Eu te amo hoje, minha princesa. Te amei ontem e vou te amar até o fim da minha vida, porque não existe outra pessoa nessa terra com quem eu possa viver o resto dela. Provavelmente eu enjoaria dos outros, ksksksksksks, e já tá mais que claro que eu nunca me enjoaria de você, nem se o mundo fosse quadrado.

Espero que goste do meu presente, mas, se não gostar, pelo menos me diz. Não gosto de mentira.

E, pela última vez, me despeço.

Boa noite, minha linda patinha.`,
  };

  function abrirCarta(idCarta) {
    const texto = cartas[idCarta] || "Mensagem especial...";
    const modal = document.createElement("div");
    modal.className = "modal-carta";

    modal.innerHTML = `
      <div class="carta-modal-box">
        <div class="carta-papel">
          <div class="carta-controles">
            <button onclick="window.zoomTexto(1)">A+</button>
            <button onclick="window.zoomTexto(-1)">A-</button>
            <button onclick="window.fecharCarta()">X</button>
          </div>
          <div class="carta-texto" id="textoCarta">
            ${texto}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  window.fecharCarta = function () {
    document.querySelector(".modal-carta")?.remove();
  };

  document.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("modal-carta")) {
      window.fecharCarta();
    }
  });

  let tamanhoFonte = 22;
  window.zoomTexto = function (valor) {
    tamanhoFonte += valor * 2;
    if (tamanhoFonte < 16) tamanhoFonte = 16;
    if (tamanhoFonte > 40) tamanhoFonte = 40;
    const textoCarta = document.getElementById("textoCarta");
    if (textoCarta) textoCarta.style.fontSize = tamanhoFonte + "px";
  };

  /* EMBARALHAR CARTAS */
  const frame = document.querySelector(".frame");

  if (frame) {
    const cartasEmbaralhadas = Array.from(frame.querySelectorAll(".mail"));

    for (let i = cartasEmbaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartasEmbaralhadas[i], cartasEmbaralhadas[j]] = [
        cartasEmbaralhadas[j],
        cartasEmbaralhadas[i],
      ];
    }

    cartasEmbaralhadas.forEach((carta) => frame.appendChild(carta));
  }

  document.querySelectorAll(".mail").forEach((envelope) => {
    let clickTimer = null;

    envelope.addEventListener("click", () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        const cartaId = envelope.dataset.carta;
        if (cartaId) abrirCarta(cartaId);
        return;
      }

      clickTimer = setTimeout(() => {
        clickTimer = null;
        envelope.classList.toggle("open");
      }, 250);
    });
  });
});
