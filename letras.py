import tkinter as tk

# Letra completa ingresada
LETRA = [
    "Brota el sentimiento y las ganas de llorar",
    "Por esas actitudes de mucha falsedad",
    "Yo sí sufrí",
    "Porque supe amar",
    "Sin imaginar",
    "Cuánto iba llorar",
    "Yo sí sentí",
    "Dolor de corazón",
    "Hasta perdí",
    "El aliento por vivir",
    "Aveces mí corazón",
    "Se pone tan triste, tan triste que me dan ganas de llorar"
]

class VentanaLetrasRedimensionable:
    def __init__(self, root):
        self.root = root
        self.root.title("letra")
        self.root.geometry("850x550")
        self.root.configure(bg="#0f0f17")
        
        # Permitir redimensionar la ventana
        self.root.resizable(True, True)

        self.index = 0

        # Título
        self.lbl_titulo = tk.Label(
            root, text="✨ YO SÍ SUFRÍ ✨", 
            font=("Comic Sans MS", 16, "bold"), fg="#ff79c6", bg="#0f0f17"
        )
        self.lbl_titulo.pack(pady=(20, 10))

        # Línea anterior (vista previa tenue)
        self.lbl_prev = tk.Label(
            root, text="", font=("Verdana", 14, "italic"), 
            fg="#44475a", bg="#0f0f17"
        )
        self.lbl_prev.pack(pady=5, fill="x")

        # Línea principal (Texto grande que se ajusta)
        self.lbl_main = tk.Label(
            root, text="Haz clic para iniciar...", 
            font=("Trebuchet MS", 26, "bold"), fg="#50fa7b", bg="#181825",
            padx=25, pady=35, relief="solid", bd=2, justify="center"
        )
        self.lbl_main.pack(pady=15, fill="both", expand=True, padx=30)

        # Línea siguiente (vista previa tenue)
        self.lbl_next = tk.Label(
            root, text="", font=("Verdana", 14, "italic"), 
            fg="#6272a4", bg="#0f0f17"
        )
        self.lbl_next.pack(pady=5, fill="x")

        # Instrucción inferior
        self.lbl_instruccion = tk.Label(
            root, text="👇 Haz clic en cualquier parte para avanzar", 
            font=("Arial", 12, "bold"), fg="#bd93f9", bg="#0f0f17"
        )
        self.lbl_instruccion.pack(side="bottom", pady=20)

        # Reajuste automático del texto al cambiar de tamaño la ventana
        self.root.bind("<Configure>", self.reajustar_texto)
        
        # Clic para avanzar línea
        self.root.bind("<Button-1>", lambda event: self.siguiente_linea())

    def reajustar_texto(self, event=None):
        ancho_actual = self.root.winfo_width() - 80
        if ancho_actual > 100:
            self.lbl_prev.config(wraplength=ancho_actual)
            self.lbl_main.config(wraplength=ancho_actual)
            self.lbl_next.config(wraplength=ancho_actual)

    def siguiente_linea(self):
        if self.index < len(LETRA):
            prev_txt = LETRA[self.index - 1] if self.index > 0 else ""
            curr_txt = LETRA[self.index]
            next_txt = LETRA[self.index + 1] if self.index + 1 < len(LETRA) else ""

            self.lbl_prev.config(text=prev_txt)
            self.lbl_main.config(text=curr_txt, fg="#50fa7b", bg="#181825")
            self.lbl_next.config(text=next_txt)

            self.index += 1
        else:
            self.lbl_prev.config(text="")
            self.lbl_main.config(text="✨ Fin de la canción ✨", fg="#ffb86c", bg="#1e1e2e")
            self.lbl_next.config(text="")
            self.lbl_instruccion.config(text="Haz clic para reiniciar")
            self.index = 0

if __name__ == "__main__":
    app = tk.Tk()
    vent = VentanaLetrasRedimensionable(app)
    app.mainloop()