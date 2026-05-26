package com.jainkundali.app.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * NeoPop (CRED-style neo-brutalism) primitives — REFERENCE.md §1.
 *
 * Rules implemented:
 *  - Hard 4dp offset shadow drawn as a real second surface behind the element (not an elevation blur).
 *  - 2dp solid border, 2dp corner radius (sharp, near-square).
 *  - Press translates the surface INTO the shadow ([translateX, translateY] = DEPTH) — no scale/opacity.
 *  - Shadow colour = a darker, saturated shade of the brand colour, never generic black on light.
 */

private val NeoPopShape = RoundedCornerShape(2.dp)
private val NeoPopDepth = 4.dp

@Composable
fun neoPopShadowColor(): Color = if (isSystemInDarkTheme()) NeoPopShadowDark else NeoPopShadowLight

@Composable
fun neoPopBorderColor(): Color = if (isSystemInDarkTheme()) NeoPopBorderDark else NeoPopBorderLight

@Composable
fun NeoPopCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = MaterialTheme.colorScheme.surface,
    borderColor: Color = neoPopBorderColor(),
    shadowColor: Color = neoPopShadowColor(),
    onClick: (() -> Unit)? = null,
    contentPadding: androidx.compose.ui.unit.Dp = 16.dp,
    content: @Composable ColumnScope.() -> Unit
) {
    Box(modifier = modifier.padding(end = NeoPopDepth, bottom = NeoPopDepth)) {
        // Hard offset shadow as a solid sibling surface.
        Box(
            Modifier
                .matchParentSize()
                .offset(x = NeoPopDepth, y = NeoPopDepth)
                .clip(NeoPopShape)
                .background(shadowColor)
        )
        var surface = Modifier
            .fillMaxWidth()
            .clip(NeoPopShape)
            .background(backgroundColor)
            .border(2.dp, borderColor, NeoPopShape)
        if (onClick != null) surface = surface.clickable { onClick() }
        Column(modifier = surface.padding(contentPadding), content = content)
    }
}

@Composable
fun NeoPopButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    containerColor: Color = MaterialTheme.colorScheme.primary,
    contentColor: Color = MaterialTheme.colorScheme.onPrimary,
    shadowColor: Color = neoPopShadowColor(),
    enabled: Boolean = true
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shift = if (pressed && enabled) NeoPopDepth else 0.dp

    Box(modifier = modifier.padding(end = NeoPopDepth, bottom = NeoPopDepth)) {
        Box(
            Modifier
                .matchParentSize()
                .offset(x = NeoPopDepth, y = NeoPopDepth)
                .clip(NeoPopShape)
                .background(shadowColor)
        )
        Box(
            Modifier
                .offset(x = shift, y = shift)
                .clip(NeoPopShape)
                .background(if (enabled) containerColor else containerColor.copy(alpha = 0.5f))
                .border(2.dp, contentColor.copy(alpha = 0.3f), NeoPopShape)
                .clickable(
                    interactionSource = interaction,
                    indication = null,
                    enabled = enabled
                ) { onClick() }
                .padding(horizontal = 20.dp, vertical = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                color = contentColor,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}
