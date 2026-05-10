package com.jainkundali.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun BeadCounter(
    isFilled: Boolean,
    size: Dp = 12.dp,
    filledColor: Color = MaterialTheme.colorScheme.primary,
    emptyColor: Color = MaterialTheme.colorScheme.surfaceVariant,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(size)) {
        drawCircle(
            color = if (isFilled) filledColor else emptyColor,
            radius = this.size.width / 2
        )
    }
}
