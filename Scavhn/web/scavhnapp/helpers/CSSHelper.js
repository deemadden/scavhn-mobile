/**
 * Created by deemadden on 9/15/13.
 */
define(

  'helpers/CSSHelper',

  [ ],

  function()
  {
    return {
      getBackgroundURLPathForAnchor: function (rootPath, imageName, imageType, asBackgroundImageAttribute, backgroundColorForBgImage, size)
      {
        var backgroundStyle;
        var backgroundAttribute;
        var backgroundValue;

        // Assumes 'sm' or 'lg' as possible arguments
        if(size)
          backgroundValue = ': url(\'resources\/img\/' + rootPath + '\/' + imageName + '-' + size + '.' + imageType.toLowerCase() + '\')';
        else
          backgroundValue = ': url(\'resources\/img\/' + rootPath + '\/' + imageName + '.' + imageType.toLowerCase() + '\')';

        var backgroundColorAttribute = backgroundColorForBgImage ? 'background-color: ' + backgroundColorForBgImage + ';' : '';

        if(asBackgroundImageAttribute)
        {
          backgroundAttribute = 'background-image';
          backgroundStyle = backgroundColorAttribute + ' ' + backgroundAttribute + backgroundValue + '; background-position: center center; background-repeat: no-repeat';
        }
        else if(asBackgroundImageAttribute == false && backgroundColorForBgImage == null && size == null) // Using this to trap the call made from the HomeScreenViewModel
        {
          backgroundAttribute = 'background';
          backgroundStyle = backgroundAttribute + backgroundValue + ' top left no-repeat;';
        }
        else
        {
          backgroundAttribute = 'background';
          backgroundStyle = backgroundAttribute + backgroundValue + ' center center no-repeat;';
        }

        return backgroundStyle;
      }
    };
  }
);
