package dev.suprisecode.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

private val Bg = Color(0xFF090B10)
private val Panel = Color(0xFF141824)
private val Accent = Color(0xFFAA9CFF)
private val Muted = Color(0xFF929CAF)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val prefs = getSharedPreferences("suprisecode", MODE_PRIVATE)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme(
                background = Bg, surface = Panel, primary = Accent,
                onBackground = Color(0xFFF0F2F8), onSurface = Color(0xFFF0F2F8)
            )) {
                SupriseCodeApp(
                    initialUrl = prefs.getString("url", "") ?: "",
                    initialPassword = prefs.getString("password", "") ?: "",
                    saveSettings = { url, password ->
                        prefs.edit().putString("url", url).putString("password", password).apply()
                    }
                )
            }
        }
    }
}

private data class ChatMessage(val role: String, val text: String)

@Composable
private fun SupriseCodeApp(
    initialUrl: String,
    initialPassword: String,
    saveSettings: (String, String) -> Unit
) {
    var baseUrl by remember { mutableStateOf(initialUrl) }
    var password by remember { mutableStateOf(initialPassword) }
    var provider by remember { mutableStateOf("openai") }
    var model by remember { mutableStateOf("") }
    var repo by remember { mutableStateOf("") }
    var prompt by remember { mutableStateOf("") }
    var showSettings by remember { mutableStateOf(initialUrl.isBlank() || initialPassword.isBlank()) }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val messages = remember { mutableStateListOf<ChatMessage>() }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().background(Bg)) {
        Row(
            Modifier.fillMaxWidth().background(Color(0xFF0D1017)).padding(horizontal = 18.dp, vertical = 15.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(shape = RoundedCornerShape(10.dp), color = Accent, modifier = Modifier.size(34.dp)) {
                Box(contentAlignment = Alignment.Center) { Icon(Icons.Default.Code, null, tint = Bg) }
            }
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Text("SupriseCode", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("REMOTE AI CODING AGENT", color = Muted, fontSize = 9.sp, letterSpacing = 1.4.sp)
            }
            IconButton(onClick = { showSettings = true }) { Icon(Icons.Default.Settings, "Settings", tint = Muted) }
        }
        if (showSettings) {
            Column(Modifier.fillMaxWidth().padding(16.dp), verticalArrangement = Arrangement.spacedBy(9.dp)) {
                Text("Connect your SupriseCode server", fontWeight = FontWeight.SemiBold)
                OutlinedTextField(baseUrl, { baseUrl = it }, label = { Text("Vercel API URL") }, placeholder = { Text("https://your-app.vercel.app") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(password, { password = it }, label = { Text("App access password") }, singleLine = true, modifier = Modifier.fillMaxWidth(), visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation())
                Button(onClick = {
                    saveSettings(baseUrl.trim().trimEnd('/'), password)
                    showSettings = false
                }, modifier = Modifier.fillMaxWidth()) { Text("Save connection") }
                Text("Your provider API keys stay on the backend. Use your own trusted deployment URL.", color = Muted, fontSize = 11.sp)
            }
        } else {
            Column(Modifier.padding(horizontal = 14.dp, vertical = 10.dp)) {
                Text("MODEL PROVIDER", color = Muted, fontSize = 9.sp, letterSpacing = 1.2.sp)
                Spacer(Modifier.height(5.dp))
                var expanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = !expanded }) {
                    OutlinedTextField(provider, {}, readOnly = true, modifier = Modifier.fillMaxWidth().menuAnchor(), trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) })
                    ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        listOf("openai", "anthropic", "google", "openrouter").forEach {
                            DropdownMenuItem(text = { Text(it) }, onClick = { provider = it; expanded = false })
                        }
                    }
                }
                OutlinedTextField(model, { model = it }, label = { Text("Model ID (optional)") }, placeholder = { Text("Use provider default") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(repo, { repo = it }, label = { Text("Public GitHub repository (optional)") }, placeholder = { Text("https://github.com/owner/repo") }, singleLine = true, modifier = Modifier.fillMaxWidth())
            }
            HorizontalDivider(color = Color(0xFF252C3A))
            if (messages.isEmpty()) {
                Column(Modifier.weight(1f).fillMaxWidth().padding(24.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                    Surface(color = Color(0xFF201C39), shape = RoundedCornerShape(18.dp), modifier = Modifier.size(58.dp)) {
                        Box(contentAlignment = Alignment.Center) { Icon(Icons.Default.Code, null, tint = Accent, modifier = Modifier.size(30.dp)) }
                    }
                    Spacer(Modifier.height(18.dp))
                    Text("Build something with AI.", fontSize = 25.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Describe a feature, fix a bug, or start from a public GitHub repository. Your coding tasks run remotely in an isolated workspace.", color = Muted, fontSize = 12.sp)
                }
            } else {
                LazyColumn(Modifier.weight(1f).fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(messages) { msg ->
                        Column(Modifier.fillMaxWidth()) {
                            Text(if (msg.role == "user") "YOU" else "SUPRISECODE", color = Accent, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(4.dp))
                            Surface(color = if (msg.role == "user") Color(0xFF1B2030) else Panel, shape = RoundedCornerShape(12.dp)) {
                                Text(msg.text, Modifier.fillMaxWidth().padding(12.dp), fontSize = 13.sp, lineHeight = 20.sp)
                            }
                        }
                    }
                    if (busy) item { LinearProgressIndicator(Modifier.fillMaxWidth(), color = Accent) }
                }
            }
            error?.let { Text(it, color = Color(0xFFFFAAB4), fontSize = 11.sp, modifier = Modifier.padding(horizontal = 14.dp)) }
            Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.Bottom) {
                OutlinedTextField(prompt, { prompt = it }, modifier = Modifier.weight(1f), placeholder = { Text("Ask SupriseCode to build or fix something…") }, maxLines = 5)
                Spacer(Modifier.width(8.dp))
                FilledIconButton(
                    enabled = prompt.isNotBlank() && !busy,
                    onClick = {
                        val text = prompt.trim()
                        prompt = ""
                        messages.add(ChatMessage("user", text))
                        error = null
                        busy = true
                        scope.launch {
                            try {
                                val reply = MobileApi.send(baseUrl, password, provider, model, repo, text)
                                messages.add(ChatMessage("assistant", reply))
                            } catch (e: Exception) {
                                error = e.message ?: "Request failed."
                            } finally { busy = false }
                        }
                    }
                ) { Icon(Icons.Default.Send, "Send") }
            }
            Text("Remote execution • Vercel Sandbox • Provider keys remain server-side", color = Muted, fontSize = 9.sp, modifier = Modifier.padding(start = 14.dp, bottom = 10.dp))
        }
    }
}
