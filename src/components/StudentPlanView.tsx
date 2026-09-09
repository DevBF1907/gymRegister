import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Calendar, CheckCircle2, Clock, ShieldCheck, FileCheck, Phone, Mail, Award, Flame } from 'lucide-react';
import { Student } from '../types';

interface StudentPlanViewProps {
  student: Student;
}

export const StudentPlanView: React.FC<StudentPlanViewProps> = ({ student }) => {
  const plan = student.plan;

  return (
    <div className="space-y-4">
      {/* Plan Header Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Plano Ativo &bull; {plan.status.toUpperCase()}
              </span>
              <span className="text-[10px] text-zinc-500">#APX-{student.id.toUpperCase()}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white mt-1.5">
              {plan.name}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 max-w-xl">
              {plan.notes || 'Plano de acompanhamento individualizado com periodização, controle de cargas e avaliações periódicas.'}
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl sm:text-right shrink-0">
            <span className="text-[9px] text-zinc-400 uppercase font-medium block">Mensalidade</span>
            <div className="text-xl font-heading font-extrabold text-emerald-400">
              R$ {plan.priceMonthly.toFixed(2)}
              <span className="text-[10px] text-zinc-500 font-normal"> /mês</span>
            </div>
            <span className="text-[9px] text-zinc-400 mt-0.5 block flex items-center sm:justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" /> Pagamentos em dia
            </span>
          </div>
        </div>

        {/* Plan Core Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-zinc-800/80">
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-medium block">Frequência Semanal</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
              {plan.weeklyFrequency}x por semana
            </span>
            <span className="text-[10px] text-zinc-400">({student.activeDays.join(', ')})</span>
          </div>

          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-medium block">Duração do Contrato</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
              {plan.durationMonths} Meses
            </span>
            <span className="text-[10px] text-zinc-400">Ciclo semestral</span>
          </div>

          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-medium block">Início da Vigência</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
              {plan.startDate.split('-').reverse().join('/')}
            </span>
            <span className="text-[10px] text-zinc-400">Assinatura digital</span>
          </div>

          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-medium block">Renovação Prevista</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 mt-0.5 block">
              {plan.endDate.split('-').reverse().join('/')}
            </span>
            <span className="text-[10px] text-zinc-400">Automática</span>
          </div>
        </div>
      </div>

      {/* Plan Benefits & Student Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Included benefits */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <h4 className="font-heading font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Benefícios Inclusos no Plano
          </h4>

          <div className="space-y-1.5 text-[11px]">
            {[
              'Aulas presenciais 1-a-1 com personal trainer credenciado (CREF)',
              'Periodização de treino personalizada com progressão contínua de carga',
              'Check-in subjetivo de bem-estar (escala 0-15) a cada aula para ajuste de volume',
              'Reavaliação física completa e fotos comparativas a cada 90 dias',
              'Acesso total ao aplicativo de aluno para histórico de cargas e agenda',
              'Canal direto de suporte via WhatsApp para dúvidas técnicas'
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student details & Emergency */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <h4 className="font-heading font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" /> Ficha Cadastral & Contatos
          </h4>

          <div className="space-y-2 text-[11px] text-zinc-300">
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-500">Objetivo Declarado</span>
              <span className="font-semibold text-white">{student.goal}</span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-500">Horário Preferencial</span>
              <span className="font-semibold text-white">{student.preferredTime}</span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-500">Contato de Emergência</span>
              <span className="font-semibold text-white">{student.emergencyContact}</span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-zinc-800">
              <span className="text-zinc-500">Condições de Saúde</span>
              <span className="font-semibold text-amber-300">
                {student.healthConditions && student.healthConditions.length > 0
                  ? student.healthConditions.join(', ')
                  : 'Nenhuma restrição relatada'}
              </span>
            </div>

            <div className="pt-1.5">
              <span className="text-zinc-500 block mb-1">Notas do Treinador:</span>
              <p className="text-zinc-400 italic bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-[11px]">
                "{student.trainerNotes}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
