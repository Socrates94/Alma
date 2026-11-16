    const { useState, useRef, useEffect, useCallback, useMemo } = React;

    const FRASES = [
      "Intenta otra vez 😏",
      "Uy, casi 😅",
      "Ese botón es muy escurridizo...",
      "¿En serio quieres decirme que no? 🥺",
      "El universo no quiere que lo presiones",
      "Ríndete, el botón de Sí es más bonito 💖",
      "Mi corazón no acepta un 'no'",
      "Llevas muchos intentos, ¿eh? 😌",
    ];

    function Corazones({ cantidad = 16, rapido = false }) {
      const items = useMemo(
        () =>
          Array.from({ length: cantidad }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * (rapido ? 5 : 10),
            dur: (rapido ? 5 : 9) + Math.random() * 6,
            size: 12 + Math.random() * 26,
            emoji: ["💖", "💕", "💗", "❤️", "🌸", "💞"][Math.floor(Math.random() * 6)],
          })),
        [cantidad, rapido]
      );

      return (
        <div className="corazones" aria-hidden="true">
          {items.map((c) => (
            <span
              key={c.id}
              style={{
                left: c.left + "%",
                animationDelay: c.delay + "s",
                animationDuration: c.dur + "s",
                fontSize: c.size + "px",
              }}
            >
              {c.emoji}
            </span>
          ))}
        </div>
      );
    }

    function App() {
      const [acepto, setAcepto] = useState(false);
      const [noPos, setNoPos] = useState(null);
      const [esquivas, setEsquivas] = useState(0);
      const noRef = useRef(null);

      const moverBotonNo = useCallback((cursor) => {
        const btn = noRef.current;
        const w = btn ? btn.offsetWidth : 130;
        const h = btn ? btn.offsetHeight : 50;
        const m = 16;
        const maxX = Math.max(m, window.innerWidth - w - m);
        const maxY = Math.max(m, window.innerHeight - h - m);

        if (!cursor) {
          setNoPos({
            left: m + Math.random() * (maxX - m),
            top: m + Math.random() * (maxY - m),
          });
          setEsquivas((n) => n + 1);
          return;
        }

        const actual = btn.getBoundingClientRect();
        const centroX = actual.left + w / 2;
        const centroY = actual.top + h / 2;
        const distanciaX = centroX - cursor.x || (Math.random() - 0.5);
        const distanciaY = centroY - cursor.y || (Math.random() - 0.5);
        const distancia = Math.hypot(distanciaX, distanciaY) || 1;
        const paso = 180;
        const destino = {
          left: Math.min(maxX, Math.max(m, actual.left + (distanciaX / distancia) * paso)),
          top: Math.min(maxY, Math.max(m, actual.top + (distanciaY / distancia) * paso)),
        };

        setNoPos(destino);
        setEsquivas((n) => n + 1);
      }, []);

      useEffect(() => {
        if (acepto) return;

        const onMove = (e) => {
          const btn = noRef.current;
          if (!btn) return;
          const r = btn.getBoundingClientRect();
          const pad = 70;
          const cerca =
            e.clientX > r.left - pad &&
            e.clientX < r.right + pad &&
            e.clientY > r.top - pad &&
            e.clientY < r.bottom + pad;
          if (cerca) moverBotonNo({ x: e.clientX, y: e.clientY });
        };

        const onResize = () => {
          setNoPos((p) => {
            if (!p) return p;
            const btn = noRef.current;
            const w = btn ? btn.offsetWidth : 130;
            const h = btn ? btn.offsetHeight : 50;
            return {
              left: Math.min(p.left, Math.max(16, window.innerWidth - w - 16)),
              top: Math.min(p.top, Math.max(16, window.innerHeight - h - 16)),
            };
          });
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("resize", onResize);
        };
      }, [acepto, moverBotonNo]);

      if (acepto) {
        return (
          <div className="escena">
            <Corazones cantidad={22} rapido />
            <div className="tarjeta">
              <div className="cheems">
                <img src="cheems.avif" alt="Cheems celebrando nuestra cita" />
              </div>
              <h1 className="titulo">¡Sabía que dirías que sí!</h1>
              <p className="lead mb-4">
                Entonces queda oficial ya somos novios: <strong>entonces tenemos una cita</strong>.
              </p>

              <ul className="lista-cita">
                <li><span>📅</span> El día que tú elijas</li>
                <li><span>🕗</span> La hora que más te acomode</li>
                <li><span>📍</span> Lugar: sorpresa (te va a gustar)</li>
                <li><span>👗</span> Dress code: guapa, como siempre</li>
              </ul>

              <p className="mt-4 mb-3 fw-semibold">
                Te paso a buscar. No acepto cancelaciones 😌
              </p>

            </div>
          </div>
        );
      }

      const frase =
        esquivas === 0
          ? "Tengo algo importante que preguntarte 👀"
          : FRASES[(esquivas - 1) % FRASES.length];

      const escalaSi = Math.min(1 + esquivas * 0.07, 1.7);

      return (
        <div className="escena">
          <Corazones />
          <div className="tarjeta">
            <div className="cheems">
              <img src="cheems.avif" alt="Cheems esperando una respuesta" />
            </div>
            <h1 className="titulo">Belen, ¿Quieres ser mi novia?</h1>
            <p className="subtitulo">{frase}</p>

            <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-4">
              <button
                className="btn btn-si"
                style={{ fontSize: escalaSi + "rem" }}
                onClick={() => setAcepto(true)}
              >
                Sí 💖
              </button>

              <button
                ref={noRef}
                className="btn btn-no"
                style={
                  noPos
                    ? { position: "fixed", top: noPos.top, left: noPos.left, margin: 0, zIndex: 60 }
                    : undefined
                }
                onPointerDown={(e) => {
                  e.preventDefault();
                  moverBotonNo({ x: e.clientX, y: e.clientY });
                }}
                onClick={(e) => {
                  e.preventDefault();
                  moverBotonNo();
                }}
              >
                No
              </button>
            </div>

            {esquivas > 1 && (
              <p className="contador">
                El botón de "No" ya te esquivó {esquivas}{" "}
                {esquivas === 1 ? "vez" : "veces"} 😌
              </p>
            )}
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
