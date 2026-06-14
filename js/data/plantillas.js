// Plantillas de jugadores reales de los países principales para alineaciones oficiales

export const PLANTILLAS_PAISES = {
    "ARG": {
        nombre: "Argentina",
        formacion: "4-3-3",
        titulares: [
            { n: 23, name: "E. Martínez", pos: "gk" },
            { n: 26, name: "N. Molina", pos: "df" },
            { n: 13, name: "C. Romero", pos: "df" },
            { n: 19, name: "N. Otamendi", pos: "df" },
            { n: 3, name: "N. Tagliafico", pos: "df" },
            { n: 7, name: "R. De Paul", pos: "mf" },
            { n: 24, name: "Enzo Fernández", pos: "mf" },
            { n: 20, name: "A. Mac Allister", pos: "mf" },
            { n: 10, name: "L. Messi", pos: "fw" },
            { n: 9, name: "J. Álvarez", pos: "fw" },
            { n: 11, name: "A. Di María", pos: "fw" }
        ],
        suplentes: ["G. Rulli", "F. Armani", "G. Pezzella", "M. Acuña", "L. Paredes", "G. Lo Celso", "L. Martínez", "P. Dybala", "N. González"],
        dt: "Lionel Scaloni"
    },
    "BRA": {
        nombre: "Brasil",
        formacion: "4-3-3",
        titulares: [
            { n: 1, name: "Alisson Becker", pos: "gk" },
            { n: 2, name: "Danilo", pos: "df" },
            { n: 3, name: "Marquinhos", pos: "df" },
            { n: 4, name: "Éder Militão", pos: "df" },
            { n: 6, name: "Renan Lodi", pos: "df" },
            { n: 5, name: "Casemiro", pos: "mf" },
            { n: 8, name: "Bruno Guimarães", pos: "mf" },
            { n: 10, name: "Lucas Paquetá", pos: "mf" },
            { n: 11, name: "Raphinha", pos: "fw" },
            { n: 9, name: "Richarlison", pos: "fw" },
            { n: 7, name: "Vinícius Jr.", pos: "fw" }
        ],
        suplentes: ["Ederson", "Bento", "Gabriel Magalhães", "Bremer", "Douglas Luiz", "João Gomes", "Endrick", "Rodrygo", "Martinelli"],
        dt: "Dorival Júnior"
    },
    "FRA": {
        nombre: "Francia",
        formacion: "4-2-3-1",
        titulares: [
            { n: 16, name: "Mike Maignan", pos: "gk" },
            { n: 5, name: "Jules Koundé", pos: "df" },
            { n: 4, name: "D. Upamecano", pos: "df" },
            { n: 24, name: "I. Konaté", pos: "df" },
            { n: 22, name: "T. Hernández", pos: "df" },
            { n: 8, name: "A. Tchouaméni", pos: "mf" },
            { n: 14, name: "Adrien Rabiot", pos: "mf" },
            { n: 11, name: "O. Dembélé", pos: "mf" },
            { n: 7, name: "A. Griezmann", pos: "mf" },
            { n: 10, name: "Kylian Mbappé", pos: "fw" },
            { n: 9, name: "Olivier Giroud", pos: "fw" }
        ],
        suplentes: ["Brice Samba", "A. Areola", "William Saliba", "Benjamin Pavard", "Y. Fofana", "E. Camavinga", "Kingsley Coman", "Marcus Thuram", "R. Kolo Muani"],
        dt: "Didier Deschamps"
    },
    "GER": {
        nombre: "Alemania",
        formacion: "4-2-3-1",
        titulares: [
            { n: 1, name: "M. Ter Stegen", pos: "gk" },
            { n: 6, name: "Joshua Kimmich", pos: "df" },
            { n: 2, name: "A. Rüdiger", pos: "df" },
            { n: 4, name: "Jonathan Tah", pos: "df" },
            { n: 3, name: "David Raum", pos: "df" },
            { n: 21, name: "I. Gündogan", pos: "mf" },
            { n: 8, name: "Toni Kroos", pos: "mf" },
            { n: 10, name: "Jamal Musiala", pos: "mf" },
            { n: 17, name: "Florian Wirtz", pos: "mf" },
            { n: 19, name: "Leroy Sané", pos: "fw" },
            { n: 7, name: "Kai Havertz", pos: "fw" }
        ],
        suplentes: ["Kevin Trapp", "Oliver Baumann", "Nico Schlotterbeck", "Robin Koch", "Robert Andrich", "Pascal Groß", "Thomas Müller", "Niclas Füllkrug", "Deniz Undav"],
        dt: "Julian Nagelsmann"
    },
    "ESP": {
        nombre: "España",
        formacion: "4-3-3",
        titulares: [
            { n: 23, name: "Unai Simón", pos: "gk" },
            { n: 2, name: "Dani Carvajal", pos: "df" },
            { n: 3, name: "R. Le Normand", pos: "df" },
            { n: 14, name: "Aymeric Laporte", pos: "df" },
            { n: 24, name: "Marc Cucurella", pos: "df" },
            { n: 16, name: "Rodri Hernández", pos: "mf" },
            { n: 8, name: "Fabián Ruiz", pos: "mf" },
            { n: 10, name: "Dani Olmo", pos: "mf" },
            { n: 19, name: "Lamine Yamal", pos: "fw" },
            { n: 7, name: "Álvaro Morata", pos: "fw" },
            { n: 17, name: "Nico Williams", pos: "fw" }
        ],
        suplentes: ["David Raya", "Álex Remiro", "Daniel Vivian", "Alejandro Grimaldo", "Martín Zubimendi", "Mikel Merino", "Pedri González", "Mikel Oyarzabal", "Ferran Torres"],
        dt: "Luis de la Fuente"
    },
    "USA": {
        nombre: "Estados Unidos",
        formacion: "4-3-3",
        titulares: [
            { n: 1, name: "Matt Turner", pos: "gk" },
            { n: 22, name: "Joe Scally", pos: "df" },
            { n: 3, name: "Chris Richards", pos: "df" },
            { n: 13, name: "Tim Ream", pos: "df" },
            { n: 5, name: "A. Robinson", pos: "df" },
            { n: 8, name: "Weston McKennie", pos: "mf" },
            { n: 6, name: "Yunus Musah", pos: "mf" },
            { n: 7, name: "Gio Reyna", pos: "mf" },
            { n: 21, name: "Timothy Weah", pos: "fw" },
            { n: 9, name: "Ricardo Pepi", pos: "fw" },
            { n: 10, name: "Christian Pulisic", pos: "fw" }
        ],
        suplentes: ["Ethan Horvath", "Sean Johnson", "Miles Robinson", "Cameron Carter-Vickers", "Tyler Adams", "Johnny Cardoso", "Brenden Aaronson", "Folarin Balogun", "Haji Wright"],
        dt: "Gregg Berhalter"
    },
    "MEX": {
        nombre: "México",
        formacion: "4-3-3",
        titulares: [
            { n: 1, name: "Luis Malagón", pos: "gk" },
            { n: 2, name: "Jorge Sánchez", pos: "df" },
            { n: 3, name: "César Montes", pos: "df" },
            { n: 5, name: "Johan Vásquez", pos: "df" },
            { n: 6, name: "Gerardo Arteaga", pos: "df" },
            { n: 4, name: "Edson Álvarez", pos: "mf" },
            { n: 24, name: "Luis Chávez", pos: "mf" },
            { n: 17, name: "Orbelín Pineda", pos: "mf" },
            { n: 15, name: "Uriel Antuna", pos: "fw" },
            { n: 11, name: "Santiago Giménez", pos: "fw" },
            { n: 9, name: "Julián Quiñones", pos: "fw" }
        ],
        suplentes: ["Julio González", "Tala Rangel", "Bryan González", "Israel Reyes", "Luis Romo", "Charly Rodríguez", "Erick Sánchez", "Alexis Vega", "Guillermo Martínez"],
        dt: "Jaime Lozano"
    },
    "CAN": {
        nombre: "Canadá",
        formacion: "4-2-3-1",
        titulares: [
            { n: 16, name: "Maxime Crépeau", pos: "gk" },
            { n: 2, name: "Alistair Johnston", pos: "df" },
            { n: 15, name: "Moïse Bombito", pos: "df" },
            { n: 13, name: "Derek Cornelius", pos: "df" },
            { n: 19, name: "Alphonso Davies", pos: "df" },
            { n: 7, name: "Stephen Eustáquio", pos: "mf" },
            { n: 8, name: "Ismaël Koné", pos: "mf" },
            { n: 14, name: "Liam Millar", pos: "mf" },
            { n: 10, name: "Jonathan David", pos: "mf" },
            { n: 9, name: "Cyle Larin", pos: "fw" },
            { n: 22, name: "J. Shaffelburg", pos: "fw" }
        ],
        suplentes: ["Dayne St. Clair", "Thomas McGill", "Kamal Miller", "Kyle Hiebert", "Samuel Piette", "Ali Ahmed", "Mathieu Choinière", "Tajon Buchanan", "Tani Oluwaseyi"],
        dt: "Jesse Marsch"
    },
    "URU": {
        nombre: "Uruguay",
        formacion: "4-3-3",
        titulares: [
            { n: 1, name: "Sergio Rochet", pos: "gk" },
            { n: 8, name: "Nahitan Nández", pos: "df" },
            { n: 4, name: "Ronald Araújo", pos: "df" },
            { n: 3, name: "José M. Giménez", pos: "df" },
            { n: 16, name: "Mathías Olivera", pos: "df" },
            { n: 15, name: "Federico Valverde", pos: "mf" },
            { n: 5, name: "Manuel Ugarte", pos: "mf" },
            { n: 7, name: "N. De la Cruz", pos: "mf" },
            { n: 11, name: "Facundo Pellistri", pos: "fw" },
            { n: 19, name: "Darwin Núñez", pos: "fw" },
            { n: 20, name: "Maximiliano Araújo", pos: "fw" }
        ],
        suplentes: ["Santiago Mele", "Franco Israel", "Sebastián Cáceres", "Lucas Olaza", "Rodrigo Bentancur", "Emiliano Martínez", "Giorgian De Arrascaeta", "Luis Suárez", "Brian Rodríguez"],
        dt: "Marcelo Bielsa"
    },
    "ENG": {
        nombre: "Inglaterra",
        formacion: "4-2-3-1",
        titulares: [
            { n: 1, name: "Jordan Pickford", pos: "gk" },
            { n: 2, name: "Kyle Walker", pos: "df" },
            { n: 5, name: "John Stones", pos: "df" },
            { n: 6, name: "Marc Guéhi", pos: "df" },
            { n: 12, name: "Kieran Trippier", pos: "df" },
            { n: 26, name: "Kobbie Mainoo", pos: "mf" },
            { n: 4, name: "Declan Rice", pos: "mf" },
            { n: 7, name: "Bukayo Saka", pos: "mf" },
            { n: 10, name: "Jude Bellingham", pos: "mf" },
            { n: 11, name: "Phil Foden", pos: "fw" },
            { n: 9, name: "Harry Kane", pos: "fw" }
        ],
        suplentes: ["Aaron Ramsdale", "Dean Henderson", "Ezri Konsa", "Joe Gomez", "Trent Alexander-Arnold", "Conor Gallagher", "Cole Palmer", "Ollie Watkins", "Jarrod Bowen"],
        dt: "Gareth Southgate"
    },
    "POR": {
        nombre: "Portugal",
        formacion: "4-3-3",
        titulares: [
            { n: 22, name: "Diogo Costa", pos: "gk" },
            { n: 20, name: "João Cancelo", pos: "df" },
            { n: 4, name: "Rúben Dias", pos: "df" },
            { n: 3, name: "Pepe Ferreira", pos: "df" },
            { n: 19, name: "Nuno Mendes", pos: "df" },
            { n: 6, name: "João Palhinha", pos: "mf" },
            { n: 23, name: "Vitinha Ferreira", pos: "mf" },
            { n: 8, name: "Bruno Fernandes", pos: "mf" },
            { n: 10, name: "Bernardo Silva", pos: "fw" },
            { n: 7, name: "Cristiano Ronaldo", pos: "fw" },
            { n: 17, name: "Rafael Leão", pos: "fw" }
        ],
        suplentes: ["José Sá", "Rui Patrício", "António Silva", "Gonçalo Inácio", "João Neves", "Danilo Pereira", "Diogo Jota", "Gonçalo Ramos", "João Félix"],
        dt: "Roberto Martínez"
    }
};
