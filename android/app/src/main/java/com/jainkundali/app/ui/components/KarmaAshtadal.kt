package com.jainkundali.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.jainkundali.app.domain.models.UserProfile
import com.jainkundali.app.domain.engine.KarmaEngine
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun KarmaAshtadal(
    profile: UserProfile,
    modifier: Modifier = Modifier
) {
    val karmaStates = KarmaEngine.calculateKarmaProfile(
        profile.dominantKarmaEn,
        profile.currentDasha.lord,
        profile.gunasthana
    )

    val primaryColor = MaterialTheme.colorScheme.primary
    val tertiaryColor = MaterialTheme.colorScheme.tertiary

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "कर्म अष्टदल",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))

        Box(
            modifier = Modifier.size(280.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val centerX = size.width / 2
                val centerY = size.height / 2
                val maxRadius = size.width * 0.38f

                karmaStates.forEachIndexed { index, karma ->
                    val angle = (index * (360.0 / 8.0) - 90) * (Math.PI / 180.0)
                    val intensity = karma.intensity / 100f
                    val petalLength = maxRadius * (0.5f + intensity * 0.5f)

                    drawPetal(
                        center = Offset(centerX, centerY),
                        angle = angle,
                        length = petalLength,
                        width = maxRadius * 0.25f,
                        color = primaryColor.copy(alpha = 0.3f + intensity * 0.7f),
                        borderColor = tertiaryColor
                    )
                }

                // Center circle
                drawCircle(
                    color = primaryColor,
                    radius = maxRadius * 0.15f,
                    center = Offset(centerX, centerY)
                )
            }

            // Center label
            Text(
                text = "कर्म\nअष्टदल",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimary,
                textAlign = TextAlign.Center
            )
        }

        // Karma labels around
        Spacer(modifier = Modifier.height(8.dp))
        val karmaNames = karmaStates.map { "${it.karmaHindi} (${it.intensity}%)" }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            karmaNames.chunked(2).forEach { row ->
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    row.forEach { name ->
                        Text(
                            text = name,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }
    }
}

private fun DrawScope.drawPetal(
    center: Offset,
    angle: Double,
    length: Float,
    width: Float,
    color: Color,
    borderColor: Color
) {
    val tipX = center.x + length * cos(angle).toFloat()
    val tipY = center.y + length * sin(angle).toFloat()

    val perpAngle = angle + Math.PI / 2
    val halfWidth = width / 2

    val leftX = center.x + halfWidth * cos(perpAngle).toFloat()
    val leftY = center.y + halfWidth * sin(perpAngle).toFloat()
    val rightX = center.x - halfWidth * cos(perpAngle).toFloat()
    val rightY = center.y - halfWidth * sin(perpAngle).toFloat()

    val path = Path().apply {
        moveTo(leftX, leftY)
        quadraticBezierTo(
            (leftX + tipX) / 2 + (tipY - center.y) * 0.1f,
            (leftY + tipY) / 2 - (tipX - center.x) * 0.1f,
            tipX, tipY
        )
        quadraticBezierTo(
            (rightX + tipX) / 2 - (tipY - center.y) * 0.1f,
            (rightY + tipY) / 2 + (tipX - center.x) * 0.1f,
            rightX, rightY
        )
        close()
    }

    drawPath(path, color)
}
