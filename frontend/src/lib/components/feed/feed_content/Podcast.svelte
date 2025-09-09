<script lang="ts">
    let {
        title,
        channel,
        platform,
        relevance,
        duration,
        isSelected
    } = $props();
    let textColor = $state("#000000");
    let backgroundOpacity = $state(1.0);
    if (!isSelected)
    {
        textColor = "#D9D9D9";
        backgroundOpacity = 0.0;
    }
</script>

<div class="rectangle" style="opacity: {backgroundOpacity}">
    <div class="content">
        <div class="tumbnail"></div>
        <div class="text-block">
            <div class="title" style="color: {textColor}">{title}</div>
            <div class="channel" style="color: {textColor}">{channel}</div>
        </div>
    </div>
    <div class="information">
        <div class="information-text" style="color: {textColor}">{platform}</div>
        <div class="information-text" style="color: {textColor}">{relevance}</div>
        <div class="information-text" style="color: {textColor}">{duration}</div>
    </div>
</div>

<style>
.rectangle {
	background-color: #D9D9D9;
    width: 1200px;
    padding: 10px;
    border-radius: 20px;
	display: flex;
}
	
.content {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.tumbnail {
    width: 50px;
    height: 50px;
	border-radius: 10px;
    background-color: #090909;
    flex-shrink: 0;
}

.text-block {
    display: flex;
    flex-direction: column;
}

.title {
    font-weight: bold;
    font-size: 18px;
}

.channel {
    color: #666;
    font-size: 14px;
}

.information {
    display: flex;
    margin-top: 15px;
	margin-left: 800px;
    gap: 8px;
}

.information-text {
    font-size: 14px;
}
</style>