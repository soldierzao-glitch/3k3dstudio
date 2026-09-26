import React, { useState, useId } from 'react';

interface InstantQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
}

export const InstantQuoteModal: React.FC<InstantQuoteModalProps> = ({
  isOpen,
  onClose,
  initialProjectTitle
}) => {
  const fileInputId = useId();
  const [technology, setTechnology] = useState<'sla' | 'fdm'>('sla');
  const [material, setMaterial] = useState('Resina 8K Alta Definição');
  const [dimX, setDimX] = useState(12);
  const [dimY, setDimY] = useState(10);
  const [dimZ, setDimZ] = useState(18);
  const [infill, setInfill] = useState(100);
  const [layerHeight, setLayerHeight] = useState('0.05mm');
  const [finish, setFinish] = useState('Pós-cura UV & Limpeza Ultrassônica');
  const [projectDescription, setProjectDescription] = useState(
    initialProjectTitle ? `Gostaria de um projeto similar a: ${initialProjectTitle}` : ''
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time physics/cost estimation simulation
  const volumeCm3 = Math.round((dimX * dimY * dimZ * (technology === 'sla' ? 0.35 : (infill / 100) * 0.4)));
  const estimatedWeightGrams = Math.round(volumeCm3 * (technology === 'sla' ? 1.15 : 1.25));
  const baseRatePerGram = technology === 'sla' ? 0.95 : 0.45;
  const finishCost = finish.includes('Pintura') ? 120 : finish.includes('Polimento') ? 60 : 25;
  const estimatedPriceMin = Math.round(Math.max(45, (estimatedWeightGrams * baseRatePerGram + finishCost) * 0.9));
  const estimatedPriceMax = Math.round(estimatedPriceMin * 1.3);
  const estimatedTimeHours = Math.max(3, Math.round(dimZ * (layerHeight === '0.05mm' ? 0.8 : 0.45)));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const generateWhatsAppUrl = () => {
    const message = `*Olá, solicito orçamento na 3K 3D Studio:*%0A` +
      `• *Tecnologia:* ${technology === 'sla' ? 'Resina 8K/12K (SLA)' : 'Filamento FDM Industrial'}%0A` +
      `• *Material:* ${material}%0A` +
      `• *Dimensões:* ${dimX}cm x ${dimY}cm x ${dimZ}cm%0A` +
      `• *Infill / Preenchimento:* ${infill}%%0A` +
      `• *Altura de Camada:* ${layerHeight}%0A` +
      `• *Acabamento:* ${finish}%0A` +
      `• *Estimativa:* ~${estimatedWeightGrams}g | R$ ${estimatedPriceMin} - ${estimatedPriceMax}%0A` +
      (uploadedFile ? `• *Arquivo anexado:* ${uploadedFile}%0A` : '') +
      (projectDescription ? `• *Observações:* ${encodeURIComponent(projectDescription)}%0A` : '');

    return `https://wa.me/5575991262118?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b0e17]/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#181b25] border border-[#3a494b] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#272a34] bg-[#10131c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fecf00]/15 border border-[#fecf00]/30 flex items-center justify-center text-[#fecf00]">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg text-[#e0e2ef] font-bold">
                Calculadora 3D &amp; Pedido sob Medida
              </h2>
              <p className="font-['JetBrains_Mono'] text-xs text-[#849495]">
                Simulação de dimensões, peso e valores para sua peça
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#849495] hover:text-[#e0e2ef] hover:bg-[#272a34] transition-colors"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          
          {/* Technology Choice */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#b9cacb]">
              1. Selecione a Tecnologia de Impressão
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTechnology('sla');
                  setMaterial('Resina 8K Alta Definição');
                  setLayerHeight('0.05mm');
                  setInfill(100);
                }}
                className={`p-3.5 rounded-xl border flex flex-col items-start gap-1 transition-all text-left ${
                  technology === 'sla'
                    ? 'bg-[#272a34] border-[#00f2fe] text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'bg-[#1c1f29] border-[#272a34] text-[#b9cacb] hover:bg-[#272a34]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-[#e0e2ef]">
                    Resina SLA 8K / 12K
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#00f2fe]/20 text-[#00f2fe]">
                    Alta Definição
                  </span>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495]">
                  Micro detalhes sem marcas de camada. Ideal para miniaturas, joalheria e rostos.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTechnology('fdm');
                  setMaterial('PETG Técnico');
                  setLayerHeight('0.15mm');
                  setInfill(40);
                }}
                className={`p-3.5 rounded-xl border flex flex-col items-start gap-1 transition-all text-left ${
                  technology === 'fdm'
                    ? 'bg-[#272a34] border-[#fecf00] text-[#fecf00] shadow-[0_0_15px_rgba(254,207,0,0.15)]'
                    : 'bg-[#1c1f29] border-[#272a34] text-[#b9cacb] hover:bg-[#272a34]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-['Space_Grotesk'] text-sm font-bold text-[#e0e2ef]">
                    Filamento FDM Industrial
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#fecf00]/20 text-[#fecf00]">
                    Resistência
                  </span>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#849495]">
                  Peças grandes, protótipos funcionais, luminárias, engrenagens e lotes comerciais.
                </span>
              </button>
            </div>
          </div>

          {/* Material Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#b9cacb]">
              2. Material Específico
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-[#1c1f29] border border-[#3a494b] text-[#e0e2ef] rounded-xl px-4 py-3 font-['Plus_Jakarta_Sans'] text-sm focus:outline-none focus:border-[#00f2fe]"
            >
              {technology === 'sla' ? (
                <>
                  <option value="Resina 8K Alta Definição">Resina 8K Cinza Escultura (Fidelidade Extrema)</option>
                  <option value="Resina Tough Translúcida">Resina Tough Translúcida (Luz Difusa &amp; Teclados)</option>
                  <option value="Resina Fotopolimérica 12K">Resina Fotopolimérica 12K Premium (Micrométrica)</option>
                  <option value="Resina Castable Joalheria">Resina Calcinável para Fundição / Joalheria</option>
                </>
              ) : (
                <>
                  <option value="Filamento Silk Ouro / Metálico">PLA Silk Ouro / Cobre / Titânio (Brilho Acetinado)</option>
                  <option value="PETG Técnico">PETG Técnico (Impacto, Tenacidade &amp; Durabilidade)</option>
                  <option value="Nylon Carbon Fiber (PA-CF)">Nylon Carga Fibra de Carbono (Grau Automotivo)</option>
                  <option value="PLA Matte Terracota">PLA Fosco Arquitetônico (Aspecto Cerâmica)</option>
                  <option value="ABS Pro Industrial">ABS Pro Anti-Delaminação (Resistência Térmica)</option>
                </>
              )}
            </select>
          </div>

          {/* Dimensions Sliders */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#b9cacb]">
                3. Dimensões Estimadas (Comprimento × Largura × Altura)
              </label>
              <span className="font-['JetBrains_Mono'] text-xs text-[#00f2fe] font-bold">
                {dimX} × {dimY} × {dimZ} cm
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">X (Largura): {dimX}cm</span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={dimX}
                  onChange={(e) => setDimX(Number(e.target.value))}
                  className="accent-[#00f2fe] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">Y (Profund.): {dimY}cm</span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={dimY}
                  onChange={(e) => setDimY(Number(e.target.value))}
                  className="accent-[#00f2fe] cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">Z (Altura): {dimZ}cm</span>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={dimZ}
                  onChange={(e) => setDimZ(Number(e.target.value))}
                  className="accent-[#00f2fe] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Infill & Layer Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#b9cacb]">
                  Preenchimento Interno (Infill)
                </label>
                <span className="font-['JetBrains_Mono'] text-xs text-[#fecf00] font-bold">
                  {infill}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={infill}
                onChange={(e) => setInfill(Number(e.target.value))}
                className="accent-[#fecf00] cursor-pointer"
              />
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#849495]">
                {infill >= 90 ? 'Maciço / Resistência Máxima' : infill >= 40 ? 'Estrutural / Forte' : 'Decorativo / Leve'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#b9cacb]">
                Altura da Camada
              </label>
              <select
                value={layerHeight}
                onChange={(e) => setLayerHeight(e.target.value)}
                className="bg-[#1c1f29] border border-[#3a494b] text-[#e0e2ef] rounded-xl px-3 py-2 text-xs font-['Plus_Jakarta_Sans'] focus:outline-none focus:border-[#00f2fe]"
              >
                <option value="0.05mm">0.05mm (Ultra-Fina / Sem marcas)</option>
                <option value="0.10mm">0.10mm (Alta Definição Balanceada)</option>
                <option value="0.20mm">0.20mm (Padrão Prototipagem Rápida)</option>
              </select>
            </div>
          </div>

          {/* Finish Type */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#b9cacb]">
              4. Tipo de Acabamento &amp; Pós-Processamento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Bruto Desmoldado (com suportes removidos)',
                'Pós-cura UV & Limpeza Ultrassônica',
                'Primer + Pintura Artística Manual',
                'Polimento Químico & Selagem UV'
              ].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFinish(f)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-['Plus_Jakarta_Sans'] transition-all ${
                    finish === f
                      ? 'bg-[#272a34] border-[#00f2fe] text-[#00f2fe] font-semibold'
                      : 'bg-[#1c1f29] border-[#272a34] text-[#b9cacb] hover:bg-[#272a34]/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Dropzone (Simulated) */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase tracking-wider text-[#b9cacb]">
              5. Já tem Arquivo ou Foto de Referência? (Opcional)
            </label>
            <label
              htmlFor={fileInputId}
              className="border-2 border-dashed border-[#3a494b] hover:border-[#00f2fe] rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-[#1c1f29]/60 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[28px] text-[#00dce6]">
                cloud_upload
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#e0e2ef]">
                {uploadedFile ? `Arquivo selecionado: ${uploadedFile}` : 'Clique para anexar (.STL, .OBJ, .STEP, .ZIP ou foto de referência)'}
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#849495]">
                Tamanho máximo 150MB • Criptografia &amp; Sigilo de Projeto (NDA)
              </span>
              <input
                id={fileInputId}
                type="file"
                className="hidden"
                accept=".stl,.obj,.step,.3mf,.zip,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Notes Input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#b9cacb]">
              Observações ou Detalhes Específicos
            </label>
            <textarea
              rows={2}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Ex: Preciso que encaixe em uma rosca M4, ou quero nas cores vermelho e dourado..."
              className="w-full bg-[#1c1f29] border border-[#3a494b] text-[#e0e2ef] placeholder:text-[#849495] rounded-xl p-3 text-xs font-['Plus_Jakarta_Sans'] focus:outline-none focus:border-[#00f2fe]"
            />
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="rounded-xl bg-[#10131c] border border-[#00f2fe]/30 p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#272a34] pb-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#00dce6] font-semibold">
                ESTIMATIVA PRELIMINAR DE PRODUÇÃO
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#849495]">
                ±5% de margem
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">Peso Estimado</span>
                <span className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-bold">
                  ~{estimatedWeightGrams} g
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">Tempo Máquina</span>
                <span className="font-['Space_Grotesk'] text-base text-[#e0e2ef] font-bold">
                  ~{estimatedTimeHours} horas
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">Faixa de Orçamento</span>
                <span className="font-['Space_Grotesk'] text-base text-[#fecf00] font-bold">
                  R$ {estimatedPriceMin} - {estimatedPriceMax}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#272a34] bg-[#10131c]">
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">
            Orçamento sem compromisso com engenheiro real
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#272a34] hover:bg-[#32343f] text-[#b9cacb] font-['Plus_Jakarta_Sans'] text-xs font-semibold"
            >
              Cancelar
            </button>

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f2fe] hover:bg-[#6ff6ff] text-[#002022] font-['Plus_Jakarta_Sans'] text-xs font-bold shadow-lg shadow-[#00f2fe]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Enviar para Engenheiro no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
