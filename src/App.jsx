import { useEffect } from 'react'
import CenaPrincipal from './scene/CenaPrincipal'
import Hero from './secoes/Hero'
import Manifesto from './secoes/Manifesto'
import Projetos from './secoes/Projetos'
import Metodo from './secoes/Metodo'
import Servicos from './secoes/Servicos'
import Contato from './secoes/Contato'
import useMovimentoReduzido from './hooks/useMovimentoReduzido'
import { iniciarScrollSuave } from './anim/scroll'
import { cargaConcluida } from './carregamento'

export default function App() {
  const reduzido = useMovimentoReduzido()

  // Scroll com inércia só pra quem não pediu menos movimento — e só
  // depois que o véu de carregamento sai: enquanto ele está no ar não há
  // o que rolar, e o rAF fica inteiro pro carregamento.
  useEffect(() => {
    if (reduzido) return undefined
    let vivo = true
    let parar
    cargaConcluida.then(() => {
      if (vivo) parar = iniciarScrollSuave()
    })
    return () => {
      vivo = false
      if (parar) parar()
    }
  }, [reduzido])

  return (
    <>
      {/* camada 1: o mundo WebGL, fixo atrás de tudo */}
      <CenaPrincipal movimentoReduzido={reduzido} />

      {/* camada 2: o conteúdo real — é isto que leitor de tela e Google leem */}
      <main>
        <Hero movimentoReduzido={reduzido} />
        <Manifesto movimentoReduzido={reduzido} />
        <Projetos movimentoReduzido={reduzido} />
        <Metodo movimentoReduzido={reduzido} />
        <Servicos movimentoReduzido={reduzido} />
        <Contato movimentoReduzido={reduzido} />
      </main>

      <footer className="pe">
        <span>© 2026 Lucas Lima</span>
        <span>Londrina · PR</span>
      </footer>
    </>
  )
}
