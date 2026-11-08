package dev.suprisecode.app

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object MobileApi {
    private val client = OkHttpClient.Builder()
        .callTimeout(6, TimeUnit.MINUTES)
        .connectTimeout(30, TimeUnit.SECONDS)
        .build()

    fun send(baseUrl: String, password: String, provider: String, model: String, repository: String, prompt: String): String {
        require(baseUrl.startsWith("https://")) { "Enter a valid HTTPS Vercel URL in Settings." }
        require(password.isNotBlank()) { "Enter your app access password in Settings." }
        val payload = JSONObject()
            .put("provider", provider)
            .put("model", model)
            .put("repositoryUrl", repository)
            .put("prompt", prompt)
        val request = Request.Builder()
            .url(baseUrl.trimEnd('/') + "/api/mobile/chat")
            .header("x-suprisecode-access", password)
            .post(payload.toString().toRequestBody("application/json; charset=utf-8".toMediaType()))
            .build()
        client.newCall(request).execute().use { response ->
            val body = response.body?.string().orEmpty()
            val json = runCatching { JSONObject(body) }.getOrNull()
            if (!response.isSuccessful) throw IllegalStateException(json?.optString("error")?.takeIf { it.isNotBlank() } ?: "Server error: HTTP ${response.code}")
            return json?.optString("text")?.takeIf { it.isNotBlank() } ?: "The agent returned an empty response."
        }
    }
}
