require 'sinatra'
require 'uri'

# Número do WhatsApp fixo
WHATSAPP_NUMBER = "5581989490518"

# debug
puts "[DEBUG] WHATSAPP_NUMBER = #{WHATSAPP_NUMBER}"


get '/' do
  erb :agendly
end

post '/send_whatsapp' do
  # anti-bot honeypot
  halt 400, "bot detected" if params[:fax] && !params[:fax].empty?

  # ler e sanitizar (limitar tamanho)
  name  = params[:name].to_s.strip[0,150]
  email = params[:email].to_s.strip[0,200]
  phone = params[:phone].to_s.strip[0,40]
  plan  = params[:plan].to_s.strip[0,50]
  msg   = params[:message].to_s.strip[0,600]

  # montar texto
  text = <<~TEXT
    Novo contato do site:
    Nome: #{name}
    Email: #{email}
    Telefone: #{phone}
    Plano: #{plan}
    Mensagem: #{msg}
  TEXT

  # montar URL do wa.me
  wa_url = "https://wa.me/#{WHATSAPP_NUMBER}?text=#{URI.encode_www_form_component(text)}"

  # debug
  puts "[DEBUG] redirecting to: #{wa_url}"

  # redirect para WhatsApp Web / App
  redirect wa_url
end
