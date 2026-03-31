import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

function Select({
  ...props
}) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props} />
  );
}

function SelectValue({
  ...props
}) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-transparent py-2 pr-3 pl-3.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=open]:border-primary/60 data-[state=open]:ring-2 data-[state=open]:ring-primary/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 4,
  ...props
}) {
  const TRACK_INSET = 10
  const optionCount = React.Children.count(children)
  const viewportRef = React.useRef(null)
  const [scrollState, setScrollState] = React.useState({
    canScroll: optionCount > 4,
    thumbHeight: optionCount > 4 ? 24 : 0,
    thumbTop: optionCount > 4 ? TRACK_INSET : 0,
  })

  const syncScrollState = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const { scrollHeight, clientHeight, scrollTop } = viewport
    const canScroll = scrollHeight > clientHeight + 1 || optionCount > 4

    const trackHeight = Math.max(0, clientHeight - TRACK_INSET * 2)
    const thumbHeight = canScroll
      ? Math.max(20, (clientHeight / scrollHeight) * trackHeight)
      : trackHeight
    const maxTop = Math.max(0, trackHeight - thumbHeight)
    const scrollProgress = canScroll
      ? scrollTop / (scrollHeight - clientHeight)
      : 0
    const thumbTop = TRACK_INSET + scrollProgress * maxTop

    setScrollState({ canScroll, thumbHeight, thumbTop })
  }, [optionCount])

  React.useLayoutEffect(() => {
    let frame = 0
    let rafId = 0

    const runSyncFrames = () => {
      syncScrollState()
      frame += 1
      if (frame < 6) {
        rafId = requestAnimationFrame(runSyncFrames)
      }
    }

    rafId = requestAnimationFrame(runSyncFrames)
    const timeoutId = window.setTimeout(syncScrollState, 180)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
    }
  }, [children, syncScrollState])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    syncScrollState()

    const resizeObserver = new ResizeObserver(() => {
      syncScrollState()
    })

    resizeObserver.observe(viewport)

    const mutationObserver = new MutationObserver(() => {
      syncScrollState()
    })

    mutationObserver.observe(viewport, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [syncScrollState])

  const showIndicator = scrollState.canScroll
  const thumbHeight = scrollState.thumbHeight > 0 ? scrollState.thumbHeight : 24
  const thumbTop = scrollState.thumbTop > 0 ? scrollState.thumbTop : TRACK_INSET

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-[70] max-h-48 min-w-36 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-xl border-2 border-primary/35 bg-white text-popover-foreground shadow-[0_26px_60px_-26px_oklch(0.16_0.03_252/.7)] ring-2 ring-primary/18 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          position ==="popper"&&"data-[side=left]:-translate-x-0.5 data-[side=right]:translate-x-0.5",
          className
        )}
        position={position}
        align={align}
        sideOffset={sideOffset}
        {...props}>
        <SelectPrimitive.Viewport
          ref={viewportRef}
          onScroll={syncScrollState}
          data-position={position}
          className={cn(
            "max-h-[9.5rem] overflow-y-auto p-1 pr-5 data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}>
          {children}
        </SelectPrimitive.Viewport>
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-2.5 right-1.5 bottom-2.5 w-1.5 rounded-full bg-border/90 transition-opacity",
            showIndicator ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_1px_oklch(0.95_0.01_240)] transition-opacity",
            showIndicator ? "opacity-100" : "opacity-0"
          )}
          style={{
            height: `${thumbHeight}px`,
            transform: `translateY(${thumbTop}px)`,
          }}
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props} />
  );
}

function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-2 pr-9 pl-3 text-sm outline-hidden select-none focus:bg-accent/70 focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}>
      <span
        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props} />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
