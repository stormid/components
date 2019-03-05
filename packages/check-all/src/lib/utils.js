export const dispatchSyntheticEvent = (node, eventType) => {
    let event = document.createEvent('Event');
    event.initEvent(eventType, true, true);
    node.dispatchEvent(event);
};