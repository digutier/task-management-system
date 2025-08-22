require "net/http"
require "json"

class LlmService
  def self.estimate_task_time(name, notes)
    return nil if notes.blank?

    # OpenAI API
    estimate_with_openai(name, notes)
  end

  private

  def self.estimate_with_openai(name, notes)
    prompt = <<~PROMPT
      Based on the following task name and notes, provide a realistic time estimate for completion.
      Return only the time estimate in a simple string format like "2 hours", "1 day", "3 weeks", etc. Only respond
      with the time estimate in english, no other text.

      Task name: #{name}
      Task notes: #{notes}
    PROMPT

    begin
      uri = URI("https://api.openai.com/v1/chat/completions")
      request = Net::HTTP::Post.new(uri)
      # TODO: Replace hardcoded token with OPENAI_API_KEY env variable (invalid token)
      request["Authorization"] = "Bearer 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"
      request["Content-Type"] = "application/json"
      request.body = {
        model: "gpt-3.5-turbo",
        messages: [ { role: "user", content: prompt } ],
        max_tokens: 50,
        temperature: 0.3
      }.to_json

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(request)
      end

      if response.code == "200"
        result = JSON.parse(response.body)
        result.dig("choices", 0, "message", "content")&.strip
      else
        Rails.logger.error "OpenAI API error: #{response.code} - #{response.body}"
        nil
      end
    rescue => e
      Rails.logger.error "LLM service error: #{e.message}"
      nil
    end
  end
end
