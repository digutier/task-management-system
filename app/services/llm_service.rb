require "net/http"
require "json"

class LlmService
  def self.estimate_task_time(name, notes)
    return nil if notes.blank?

    # OpenRouter API
    estimate_with_openrouter(name, notes)
  end

  private

  def self.estimate_with_openrouter(name, notes)
    prompt = <<~PROMPT
      Based on the following task name and notes, provide a realistic time estimate for completion.
      Return only the time estimate in a simple string format like "2 hours", "1 day", "3 weeks", etc. No more words and only answer in english.

      Task name: #{name}
      Task notes: #{notes}
    PROMPT

    begin
      uri = URI("https://openrouter.ai/api/v1/chat/completions")
      api_key = ENV["OPENROUTER_API_KEY"]
      request = Net::HTTP::Post.new(uri)
      request["Authorization"] = "Bearer #{api_key}"
      request["Content-Type"] = "application/json"
      request.body = {
        model: "google/gemini-2.0-flash-lite-001",
        messages: [
          { role: "system", content: "You are a helpful assistant that estimates the time to complete a task based on the task name and notes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 20,
        temperature: 0.1
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
