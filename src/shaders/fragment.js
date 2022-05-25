// Fragment shader used for applying filters to textures.
// Most of the convolution code was taken from wikipedia:
// https://en.wikipedia.org/wiki/Kernel_(image_processing)
// With a majority of this GLSL written by csblo
export const fsSource = `
    uniform vec2 resolution;
    uniform sampler2D texture1;
    uniform int uFilter;

    varying vec2 vUv;

    // Filter type constants
    #define FILTER_IDENTITY 0
    #define FILTER_BOX_BLUR 1
    #define FILTER_GAUSSIAN_BLUR 2
    #define FILTER_PIXELATE 3
    #define FILTER_GREYSCALE 4
    #define FILTER_EMBOSS 5
    #define FILTER_SHARPEN 6
    #define FILTER_RIDGE 7
    #define FILTER_MONOCHROME 8

    #define MONOCHROME_THRESHOLD 0.3

    #define BLACK vec3(0.0)
    #define WHITE vec3(1.0)

    // Define kernels
    #define identity mat3(0, 0, 0, 0, 1, 0, 0, 0, 0)
    #define edge0 mat3(1, 0, -1, 0, 0, 0, -1, 0, 1)
    #define edge1 mat3(0, 1, 0, 1, -4, 1, 0, 1, 0)
    #define edge2 mat3(-1, -1, -1, -1, 8, -1, -1, -1, -1)
    #define sharpen mat3(0, -1, 0, -1, 5, -1, 0, -1, 0)
    #define box_blur mat3(1, 1, 1, 1, 1, 1, 1, 1, 1) * 0.1111
    #define gaussian_blur mat3(1, 2, 1, 2, 4, 2, 1, 2, 1) * 0.0625
    #define emboss mat3(-2, -1, 0, -1, 1, 1, 0, 1, 2)
    #define ridge mat3(-1, -1, -1, -1, 4, -1, -1, -1, -1)

    // Find coordinate of matrix element from index
    vec2 kpos(int index)
    {
        return vec2[9] (
            vec2(-1, -1), vec2(0, -1), vec2(1, -1),
            vec2(-1, 0), vec2(0, 0), vec2(1, 0),
            vec2(-1, 1), vec2(0, 1), vec2(1, 1)
        )[index] / resolution.xy;
    }


    // Extract region of dimension 3x3 from sampler centered in uv
    // sampler : texture sampler
    // uv : current coordinates on sampler
    // return : an array of mat3, each index corresponding with a color channel
    mat3[3] region3x3(sampler2D sampler, vec2 uv)
    {
        // Create each pixels for region
        vec4[9] region;

        for (int i = 0; i < 9; i++)
            region[i] = texture(sampler, uv + kpos(i));

        // Create 3x3 region with 3 color channels (red, green, blue)
        mat3[3] mRegion;

        for (int i = 0; i < 3; i++)
            mRegion[i] = mat3(
                region[0][i], region[1][i], region[2][i],
                region[3][i], region[4][i], region[5][i],
                region[6][i], region[7][i], region[8][i]
            );

        return mRegion;
    }

    vec3 convolution(mat3 kernel, sampler2D sampler, vec2 uv)
    {
        vec3 fragment;

        // Extract a 3x3 region centered in uv
        mat3[3] region = region3x3(sampler, uv);

        // for each color channel of region
        for (int i = 0; i < 3; i++)
        {
            // get region channel
            mat3 rc = region[i];
            // component wise multiplication of kernel by region channel
            mat3 c = matrixCompMult(kernel, rc);
            // add each component of matrix
            float r = c[0][0] + c[1][0] + c[2][0]
                    + c[0][1] + c[1][1] + c[2][1]
                    + c[0][2] + c[1][2] + c[2][2];

            // for fragment at channel i, set result
            fragment[i] = r;
        }

        return fragment;
    }

    // Average function used for greyscale
    vec3 greyscale(vec3 c) {
        return vec3((c.r + c.g + c.b) / 3.0);
    }

    vec3 monochrome(vec3 c) {
        vec3 texColor = texture2D(texture1, vUv).rgb;
        if (greyscale(texColor).r > MONOCHROME_THRESHOLD)
            return WHITE;
        else
            return BLACK;
    }

    vec3 pixelate(float pixel_size) {
        float pixelWidth = floor(resolution.x * pixel_size);
        float pixelHeight = floor(resolution.x * pixel_size);

        vec2 fragCoord = vec2(
            floor(vUv.x * resolution.x),
            floor(vUv.y * resolution.y)
        );

        vec2 boundingBox = vec2(
            floor(fragCoord.x / pixelWidth) * pixelWidth,
            floor(fragCoord.y / pixelHeight) * pixelHeight
        );

        vec2 uv = boundingBox / resolution.xy;
        return texture2D(texture1, uv).rgb;
    }

    void main()
    {
        vec3 col;

        switch (uFilter) {
            case FILTER_IDENTITY:
                col = convolution(identity, texture1, vUv);
                break;
            case FILTER_BOX_BLUR:
                col = convolution(box_blur, texture1, vUv);
                break;
            case FILTER_GAUSSIAN_BLUR:
                col = convolution(gaussian_blur, texture1, vUv);
                break;
            case FILTER_PIXELATE:
                col = pixelate(0.025);
                break;
            case FILTER_GREYSCALE:
                col = greyscale(texture2D(texture1, vUv).rgb);
                break;
            case FILTER_EMBOSS:
                col = convolution(emboss, texture1, vUv);
                break;
            case FILTER_SHARPEN:
                col = convolution(sharpen, texture1, vUv);
                break;
            case FILTER_RIDGE:
                col = convolution(ridge, texture1, vUv);
                break;
            case FILTER_MONOCHROME:
                col = monochrome(texture2D(texture1, vUv).rgb);
                break;
        }

        gl_FragColor = vec4(col, 1.0);
    }
`;
