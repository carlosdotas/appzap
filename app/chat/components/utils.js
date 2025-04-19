export function scrollParaFim(ref) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  }
  
  export function getContatoInfo(mensagens) {
    const contato = mensagens.find((m) => m.from_me === '0' || m.from_me === false) || {};
    return {
      nome: contato.sender_pushname || contato.sender_name || 'Contato',
      nome_curto: contato.sender_short_name ,      
      avatar: contato.sender_profile_thumb || '/avatar.jpg',
      sender_id: contato.sender_id || '',
      phone: (contato.sender_id || '').split('@')[0],
    };
  }
  
  export async function enviarMensagem({ jid, mensagem, setMensagens, setMensagem, socketUrl }) {
    if (!mensagem.trim()) return;
  
    const payload = { to: jid, message: mensagem };
  
    try {
      const res = await fetch(`${socketUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        const erro = await res.text();
        alert('Erro ao enviar: ' + erro);
        return;
      }
  
      setMensagens(prev => [...prev, {
        message: mensagem,
        timestamp: new Date().toISOString(),
        from_me: '1',
        chatId: jid
      }]);
  
      setMensagem('');
    } catch (err) {
      alert('Erro ao enviar mensagem: ' + err.message);
    }
  }
  