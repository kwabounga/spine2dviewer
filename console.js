function logIt(text)
{
  if(!text)return;
  console.log('> '+text);
  $('.viewport-log').html('> '+text);
}
